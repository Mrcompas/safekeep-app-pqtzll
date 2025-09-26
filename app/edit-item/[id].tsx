
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Item, ItemFormData } from '../../types/item';
import { getItems, updateItem } from '../../utils/storage';
import { scheduleWarrantyNotification, cancelWarrantyNotification } from '../../utils/notifications';
import { showImagePickerOptions } from '../../utils/camera';
import { useAuth } from '../../hooks/useAuth';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import DatePicker from '../../components/DatePicker';
import WarrantySelector from '../../components/WarrantySelector';
import Icon from '../../components/Icon';

export default function EditItemScreen() {
  console.log('EditItemScreen rendered');

  const { id } = useLocalSearchParams();
  const { authState } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<ItemFormData>({
    productName: '',
    purchaseDate: new Date(),
    warrantyLength: 12,
    storeName: '',
    receiptImageUri: undefined,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadItem = useCallback(async () => {
    try {
      console.log('Loading item for editing:', id);
      const items = await getItems();
      const foundItem = items.find(item => item.id === id);
      
      if (foundItem) {
        setItem(foundItem);
        setFormData({
          productName: foundItem.productName,
          purchaseDate: foundItem.purchaseDate,
          warrantyLength: foundItem.warrantyLength,
          storeName: foundItem.storeName,
          receiptImageUri: foundItem.receiptImageUri,
        });
      } else {
        Alert.alert(
          'Item Not Found',
          'The item you are trying to edit could not be found.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.error('Error loading item:', error);
      Alert.alert(
        'Error',
        'Failed to load item details. Please try again.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  const validateForm = (): boolean => {
    if (!formData.productName.trim()) {
      Alert.alert('Error', 'Please enter a product name.');
      return false;
    }
    if (!formData.storeName.trim()) {
      Alert.alert('Error', 'Please enter a store name.');
      return false;
    }
    if (!formData.purchaseDate) {
      Alert.alert('Error', 'Please select a purchase date.');
      return false;
    }
    if (!formData.warrantyLength || formData.warrantyLength <= 0) {
      Alert.alert('Error', 'Please select a warranty length.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!item || !validateForm()) return;

    setSaving(true);
    try {
      console.log('Updating item:', formData);

      const updatedItem: Item = {
        ...item,
        productName: formData.productName.trim(),
        purchaseDate: formData.purchaseDate,
        warrantyLength: formData.warrantyLength,
        storeName: formData.storeName.trim(),
        receiptImageUri: formData.receiptImageUri,
        updatedAt: new Date(),
      };

      await updateItem(updatedItem);
      console.log('Item updated successfully');

      // Update notification if warranty details changed
      if (item.warrantyLength !== formData.warrantyLength || 
          item.purchaseDate.getTime() !== formData.purchaseDate.getTime()) {
        try {
          // Cancel old notification
          await cancelWarrantyNotification(item.id);
          
          // Schedule new notification
          const expirationDate = new Date(formData.purchaseDate);
          expirationDate.setMonth(expirationDate.getMonth() + formData.warrantyLength);
          
          const notificationId = await scheduleWarrantyNotification(
            item.id,
            formData.productName,
            expirationDate
          );
          
          if (notificationId) {
            console.log('Notification updated for item:', formData.productName);
          }
        } catch (notificationError) {
          console.error('Error updating notification:', notificationError);
          // Don't fail the save if notification scheduling fails
        }
      }

      Alert.alert(
        'Success',
        'Item updated successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAttachReceipt = async () => {
    try {
      const result = await showImagePickerOptions();
      if (result.success && result.imageUri) {
        setFormData({ ...formData, receiptImageUri: result.imageUri });
      } else if (result.error && result.error !== 'Canceled') {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('Error attaching receipt:', error);
      Alert.alert('Error', 'Failed to attach receipt. Please try again.');
    }
  };

  const handleRemoveReceipt = () => {
    Alert.alert(
      'Remove Receipt',
      'Are you sure you want to remove the receipt photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => setFormData({ ...formData, receiptImageUri: undefined })
        },
      ]
    );
  };

  const handleCancel = () => {
    if (!item) return;

    const hasChanges = 
      formData.productName !== item.productName ||
      formData.storeName !== item.storeName ||
      formData.warrantyLength !== item.warrantyLength ||
      formData.purchaseDate.getTime() !== item.purchaseDate.getTime() ||
      formData.receiptImageUri !== item.receiptImageUri;

    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => router.back()
          },
        ]
      );
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, commonStyles.center]}>
          <Text style={commonStyles.text}>Loading item...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, commonStyles.center]}>
          <Icon name="alert-circle" size={60} color={colors.error} style={{ marginBottom: 16 }} />
          <Text style={commonStyles.emptyStateText}>Item Not Found</Text>
          <TouchableOpacity
            style={[buttonStyles.primary, { marginTop: 24 }]}
            onPress={() => router.back()}
          >
            <Text style={buttonStyles.text}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={commonStyles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ paddingBottom: 40 }}>
            {/* Header */}
            <View style={[commonStyles.row, { marginBottom: 32 }]}>
              <TouchableOpacity onPress={handleCancel}>
                <Icon name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[commonStyles.title, { flex: 1, textAlign: 'center', marginBottom: 0 }]}>
                Edit Item
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <Text style={[commonStyles.textSecondary, { marginBottom: 32 }]}>
              Update the details of your product warranty.
            </Text>

            <TextInput
              label="Product Name"
              value={formData.productName}
              onChangeText={(text) => setFormData({ ...formData, productName: text })}
              placeholder="e.g., iPhone 15 Pro, Samsung TV"
              required
            />

            <DatePicker
              label="Purchase Date"
              value={formData.purchaseDate}
              onChange={(date) => setFormData({ ...formData, purchaseDate: date })}
            />

            <WarrantySelector
              label="Warranty Length"
              value={formData.warrantyLength}
              onChange={(months) => setFormData({ ...formData, warrantyLength: months })}
            />

            <TextInput
              label="Store Name"
              value={formData.storeName}
              onChangeText={(text) => setFormData({ ...formData, storeName: text })}
              placeholder="e.g., Best Buy, Amazon, Apple Store"
              required
            />

            {/* Receipt Photo Section */}
            <View style={{ marginTop: 8 }}>
              <Text style={[commonStyles.inputLabel, { marginBottom: 12 }]}>
                Receipt Photo (Optional)
              </Text>
              
              {formData.receiptImageUri ? (
                <View style={commonStyles.card}>
                  <View style={[commonStyles.row, { marginBottom: 12 }]}>
                    <Text style={[commonStyles.text, { fontWeight: '600' }]}>Receipt Attached</Text>
                    <TouchableOpacity onPress={handleRemoveReceipt}>
                      <Icon name="trash" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                  
                  <Image
                    source={{ uri: formData.receiptImageUri }}
                    style={{
                      width: '100%',
                      height: 200,
                      borderRadius: 8,
                      backgroundColor: colors.cardBackground,
                    }}
                    resizeMode="cover"
                  />
                  
                  <TouchableOpacity
                    style={[buttonStyles.secondary, { marginTop: 12 }]}
                    onPress={handleAttachReceipt}
                  >
                    <Text style={buttonStyles.textSecondary}>Change Photo</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    commonStyles.card,
                    {
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      borderColor: colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: 32,
                    }
                  ]}
                  onPress={handleAttachReceipt}
                >
                  <Icon name="camera" size={32} color={colors.textSecondary} style={{ marginBottom: 8 }} />
                  <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                    Attach Receipt
                  </Text>
                  <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
                    Take a photo or choose from library{'\n'}to keep proof of purchase
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={{ marginTop: 32, gap: 16 }}>
              <Button
                text={saving ? 'Saving Changes...' : 'Save Changes'}
                onPress={handleSave}
                disabled={saving}
                style={buttonStyles.primary}
                textStyle={buttonStyles.text}
              />
              
              <Button
                text="Cancel"
                onPress={handleCancel}
                disabled={saving}
                style={buttonStyles.secondary}
                textStyle={buttonStyles.textSecondary}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
