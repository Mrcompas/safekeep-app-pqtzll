
import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Item, ItemFormData } from '../types/item';
import { saveItem } from '../utils/storage';
import { scheduleWarrantyNotification } from '../utils/notifications';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import DatePicker from '../components/DatePicker';
import WarrantySelector from '../components/WarrantySelector';

export default function AddScreen() {
  console.log('AddScreen rendered');

  const [formData, setFormData] = useState<ItemFormData>({
    productName: '',
    purchaseDate: new Date(),
    warrantyLength: 12,
    storeName: '',
  });
  const [saving, setSaving] = useState(false);

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
    if (!validateForm()) return;

    setSaving(true);
    try {
      console.log('Saving item:', formData);

      const newItem: Item = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        productName: formData.productName.trim(),
        purchaseDate: formData.purchaseDate,
        warrantyLength: formData.warrantyLength,
        storeName: formData.storeName.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await saveItem(newItem);
      console.log('Item saved successfully');

      // Schedule notification for warranty expiration
      try {
        const expirationDate = new Date(newItem.purchaseDate);
        expirationDate.setMonth(expirationDate.getMonth() + newItem.warrantyLength);
        
        const notificationId = await scheduleWarrantyNotification(
          newItem.id,
          newItem.productName,
          expirationDate
        );
        
        if (notificationId) {
          console.log('Notification scheduled for item:', newItem.productName);
        }
      } catch (notificationError) {
        console.error('Error scheduling notification:', notificationError);
        // Don't fail the save if notification scheduling fails
      }

      Alert.alert(
        'Success',
        'Item saved successfully!',
        [
          {
            text: 'Add Another',
            onPress: () => {
              setFormData({
                productName: '',
                purchaseDate: new Date(),
                warrantyLength: 12,
                storeName: '',
              });
            },
          },
          {
            text: 'View Items',
            onPress: () => router.push('/'),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('Error', 'Failed to save item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (formData.productName || formData.storeName) {
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
            <Text style={commonStyles.title}>Add New Item</Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 32 }]}>
              Enter the details of your product to track its warranty.
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

            <View style={{ marginTop: 32, gap: 16 }}>
              <Button
                text={saving ? 'Saving...' : 'Save Item'}
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
