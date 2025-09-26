
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import DatePicker from '../components/DatePicker';
import WarrantySelector from '../components/WarrantySelector';
import BarcodeScanner from '../components/BarcodeScanner';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { saveItem } from '../utils/storage';
import { showImagePickerOptions } from '../utils/camera';
import { useAuth } from '../hooks/useAuth';
import { router } from 'expo-router';
import Icon from '../components/Icon';
import { scheduleWarrantyNotification } from '../utils/notifications';
import { Item, ItemFormData } from '../types/item';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddScreen() {
  const [formData, setFormData] = useState<ItemFormData>({
    productName: '',
    purchaseDate: new Date(),
    warrantyLength: 12,
    storeName: '',
    receiptImageUri: undefined,
    price: undefined,
    barcode: undefined,
  });
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [priceText, setPriceText] = useState('');
  
  const { user } = useAuth();

  const validateForm = (): boolean => {
    if (!formData.productName.trim()) {
      Alert.alert('Error', 'Please enter a product name');
      return false;
    }
    if (!formData.storeName.trim()) {
      Alert.alert('Error', 'Please enter a store name');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const price = priceText ? parseFloat(priceText) : undefined;
      
      const newItem: Item = {
        id: Date.now().toString(),
        productName: formData.productName.trim(),
        purchaseDate: formData.purchaseDate,
        warrantyLength: formData.warrantyLength,
        storeName: formData.storeName.trim(),
        receiptImageUri: formData.receiptImageUri,
        userId: user?.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        price,
        barcode: formData.barcode,
      };

      await saveItem(newItem);
      await scheduleWarrantyNotification(newItem);
      
      Alert.alert('Success', 'Item added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.log('Error saving item:', error);
      Alert.alert('Error', 'Failed to save item. Please try again.');
    }
  };

  const handleAttachReceipt = async () => {
    try {
      const imageUri = await showImagePickerOptions();
      if (imageUri) {
        setFormData(prev => ({ ...prev, receiptImageUri: imageUri }));
      }
    } catch (error) {
      console.log('Error attaching receipt:', error);
      Alert.alert('Error', 'Failed to attach receipt');
    }
  };

  const handleRemoveReceipt = () => {
    setFormData(prev => ({ ...prev, receiptImageUri: undefined }));
  };

  const handleBarcodeScan = (productName: string) => {
    setFormData(prev => ({ ...prev, productName }));
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
          <View style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
              <TouchableOpacity onPress={handleCancel} style={{ marginRight: 16 }}>
                <Icon name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[commonStyles.title, { flex: 1 }]}>Add New Item</Text>
            </View>

            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={[commonStyles.textSecondary, { fontSize: 16, fontWeight: '500', flex: 1 }]}>
                  Product Name
                </Text>
                <TouchableOpacity
                  style={styles.scanButton}
                  onPress={() => setShowBarcodeScanner(true)}
                >
                  <Icon name="barcode-outline" size={16} color={colors.primary} />
                  <Text style={styles.scanButtonText}>Scan</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                value={formData.productName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, productName: text }))}
                placeholder="Enter product name"
              />
            </View>

            <DatePicker
              label="Purchase Date"
              value={formData.purchaseDate}
              onChange={(date) => setFormData(prev => ({ ...prev, purchaseDate: date }))}
            />

            <WarrantySelector
              label="Warranty Length"
              value={formData.warrantyLength}
              onChange={(months) => setFormData(prev => ({ ...prev, warrantyLength: months }))}
            />

            <TextInput
              label="Store Name"
              value={formData.storeName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, storeName: text }))}
              placeholder="Where did you buy this?"
            />

            <TextInput
              label="Price (Optional)"
              value={priceText}
              onChangeText={setPriceText}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />

            {/* Receipt Section */}
            <View style={{ marginBottom: 24 }}>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8, fontSize: 16, fontWeight: '500' }]}>
                Receipt Photo (Optional)
              </Text>
              
              {formData.receiptImageUri ? (
                <View style={styles.receiptContainer}>
                  <Image source={{ uri: formData.receiptImageUri }} style={styles.receiptImage} />
                  <TouchableOpacity style={styles.removeReceiptButton} onPress={handleRemoveReceipt}>
                    <Icon name="close-circle" size={24} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.attachButton} onPress={handleAttachReceipt}>
                  <Icon name="camera-outline" size={24} color={colors.primary} />
                  <Text style={styles.attachButtonText}>Attach Receipt</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
              <Button
                title="Cancel"
                onPress={handleCancel}
                style={[buttonStyles.secondary, { flex: 1 }]}
                textStyle={{ color: colors.text }}
              />
              <Button
                title="Save Item"
                onPress={handleSave}
                style={[buttonStyles.primary, { flex: 1 }]}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BarcodeScanner
        visible={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onScan={handleBarcodeScan}
      />
    </SafeAreaView>
  );
}

const styles = {
  scanButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary + '20',
    borderRadius: 8,
    gap: 4,
  },
  scanButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  receiptContainer: {
    position: 'relative' as const,
    alignSelf: 'flex-start' as const,
  },
  receiptImage: {
    width: 120,
    height: 160,
    borderRadius: 8,
    backgroundColor: colors.grey,
  },
  removeReceiptButton: {
    position: 'absolute' as const,
    top: -8,
    right: -8,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  attachButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed' as const,
    borderRadius: 12,
    backgroundColor: colors.primary + '10',
    gap: 8,
  },
  attachButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500' as const,
  },
};
