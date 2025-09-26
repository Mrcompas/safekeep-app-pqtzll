
import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { Item, ItemFormData } from '../types/item';
import { saveItem } from '../utils/storage';
import TextInput from '../components/TextInput';
import DatePicker from '../components/DatePicker';
import WarrantySelector from '../components/WarrantySelector';
import Button from '../components/Button';

export default function AddScreen() {
  console.log('AddScreen rendered');

  const [formData, setFormData] = useState<ItemFormData>({
    productName: '',
    purchaseDate: new Date(),
    warrantyLength: 12,
    storeName: '',
  });

  const [errors, setErrors] = useState<Partial<ItemFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ItemFormData> = {};

    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }

    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    }

    if (formData.purchaseDate > new Date()) {
      newErrors.purchaseDate = 'Purchase date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    console.log('Save button pressed');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsLoading(true);

    try {
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
      
      console.log('Item saved successfully:', newItem);
      
      Alert.alert(
        'Success',
        'Item added successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                productName: '',
                purchaseDate: new Date(),
                warrantyLength: 12,
                storeName: '',
              });
              setErrors({});
              // Navigate to home screen
              router.push('/');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert(
        'Error',
        'Failed to save item. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('Cancel button pressed');
    
    // Check if form has any data
    const hasData = formData.productName.trim() || 
                   formData.storeName.trim() || 
                   formData.purchaseDate.toDateString() !== new Date().toDateString() ||
                   formData.warrantyLength !== 12;

    if (hasData) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              // Reset form and navigate back
              setFormData({
                productName: '',
                purchaseDate: new Date(),
                warrantyLength: 12,
                storeName: '',
              });
              setErrors({});
              router.push('/');
            },
          },
        ]
      );
    } else {
      router.push('/');
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
          <View style={{ paddingBottom: 100 }}>
            <Text style={commonStyles.title}>Add New Item</Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 32 }]}>
              Enter the details of your product to track its warranty information.
            </Text>

            <View style={commonStyles.card}>
              <TextInput
                label="Product Name"
                value={formData.productName}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, productName: text }));
                  if (errors.productName) {
                    setErrors(prev => ({ ...prev, productName: undefined }));
                  }
                }}
                placeholder="e.g., iPhone 15 Pro, Samsung TV, etc."
                error={errors.productName}
                autoCapitalize="words"
                returnKeyType="next"
              />

              <DatePicker
                label="Purchase Date"
                value={formData.purchaseDate}
                onChange={(date) => {
                  setFormData(prev => ({ ...prev, purchaseDate: date }));
                  if (errors.purchaseDate) {
                    setErrors(prev => ({ ...prev, purchaseDate: undefined }));
                  }
                }}
              />

              <WarrantySelector
                label="Warranty Length"
                value={formData.warrantyLength}
                onChange={(months) => {
                  setFormData(prev => ({ ...prev, warrantyLength: months }));
                }}
              />

              <TextInput
                label="Store Name"
                value={formData.storeName}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, storeName: text }));
                  if (errors.storeName) {
                    setErrors(prev => ({ ...prev, storeName: undefined }));
                  }
                }}
                placeholder="e.g., Best Buy, Amazon, Apple Store, etc."
                error={errors.storeName}
                autoCapitalize="words"
                returnKeyType="done"
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
              <Button
                text="Cancel"
                onPress={handleCancel}
                style={[buttonStyles.secondary, { flex: 1 }]}
                textStyle={buttonStyles.textSecondary}
              />
              <Button
                text={isLoading ? "Saving..." : "Save Item"}
                onPress={handleSave}
                style={[buttonStyles.primary, { flex: 1 }]}
                textStyle={buttonStyles.text}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
