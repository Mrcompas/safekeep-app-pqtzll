
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { useWarrantyItems } from '../hooks/useWarrantyItems';
import Icon from '../components/Icon';

export default function AddItemScreen() {
  const router = useRouter();
  const { addItem } = useWarrantyItems();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [warrantyDuration, setWarrantyDuration] = useState('12');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = [
    'Electronics',
    'Appliances',
    'Automotive',
    'Home & Garden',
    'Footwear',
    'Clothing',
    'Furniture',
    'Tools',
    'Other',
  ];

  const warrantyOptions = [
    { label: '3 months', value: '3' },
    { label: '6 months', value: '6' },
    { label: '1 year', value: '12' },
    { label: '2 years', value: '24' },
    { label: '3 years', value: '36' },
    { label: '5 years', value: '60' },
  ];

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    if (!warrantyDuration || isNaN(Number(warrantyDuration))) {
      Alert.alert('Error', 'Please enter a valid warranty duration');
      return;
    }

    const newItem = {
      name: name.trim(),
      category: category || undefined,
      purchaseDate,
      warrantyDuration: Number(warrantyDuration),
      price: price ? Number(price) : undefined,
      notes: notes.trim() || undefined,
    };

    addItem(newItem);
    console.log('Item saved successfully');
    router.back();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPurchaseDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={commonStyles.title}>Add Item</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          {/* Item Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Item Name *</Text>
            <TextInput
              style={commonStyles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., iPhone 15 Pro"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.categoryChipSelected
                  ]}
                  onPress={() => setCategory(category === cat ? '' : cat)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    category === cat && styles.categoryChipTextSelected
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Purchase Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Purchase Date</Text>
            <TouchableOpacity
              style={[commonStyles.input, styles.dateInput]}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon name="calendar-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.dateText}>
                {purchaseDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Warranty Duration */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Warranty Duration</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.warrantyScroll}
            >
              {warrantyOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.warrantyChip,
                    warrantyDuration === option.value && styles.warrantyChipSelected
                  ]}
                  onPress={() => setWarrantyDuration(option.value)}
                >
                  <Text style={[
                    styles.warrantyChipText,
                    warrantyDuration === option.value && styles.warrantyChipTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TextInput
              style={[commonStyles.input, { marginTop: 8 }]}
              value={warrantyDuration}
              onChangeText={setWarrantyDuration}
              placeholder="Custom duration (months)"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          {/* Price */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price (Optional)</Text>
            <TextInput
              style={commonStyles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[commonStyles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Additional information..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={[buttonStyles.primary, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={buttonStyles.text}>Save Item</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={purchaseDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.backgroundAlt,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryChip: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500' as const,
  },
  categoryChipTextSelected: {
    color: colors.background,
  },
  dateInput: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  warrantyScroll: {
    marginBottom: 8,
  },
  warrantyChip: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  warrantyChipSelected: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  warrantyChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500' as const,
  },
  warrantyChipTextSelected: {
    color: colors.background,
  },
  notesInput: {
    height: 80,
    paddingTop: 12,
  },
  saveButton: {
    marginTop: 16,
    marginBottom: 32,
  },
};
