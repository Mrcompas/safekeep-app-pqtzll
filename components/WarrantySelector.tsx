
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface WarrantySelectorProps {
  value: number;
  onChange: (months: number) => void;
  label: string;
}

const warrantyOptions = [
  { label: '6 months', value: 6 },
  { label: '12 months', value: 12 },
  { label: '24 months', value: 24 },
  { label: '36 months', value: 36 },
];

export default function WarrantySelector({ value, onChange, label }: WarrantySelectorProps) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [customUnit, setCustomUnit] = useState<'months' | 'years'>('months');

  const isCustomValue = !warrantyOptions.some(option => option.value === value);

  const handleCustomSave = () => {
    const numValue = parseInt(customValue);
    if (numValue && numValue > 0) {
      const months = customUnit === 'years' ? numValue * 12 : numValue;
      onChange(months);
      setShowCustomModal(false);
      setCustomValue('');
    }
  };

  const getCustomLabel = (months: number) => {
    if (months >= 12 && months % 12 === 0) {
      const years = months / 12;
      return years === 1 ? '1 year' : `${years} years`;
    }
    return months === 1 ? '1 month' : `${months} months`;
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[commonStyles.textSecondary, { marginBottom: 8, fontSize: 16, fontWeight: '500' }]}>
        {label}
      </Text>
      <View style={styles.optionsContainer}>
        {warrantyOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              value === option.value && styles.selectedOption,
            ]}
            onPress={() => onChange(option.value)}
          >
            <Text
              style={[
                styles.optionText,
                value === option.value && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity
          style={[
            styles.option,
            styles.customOption,
            isCustomValue && styles.selectedOption,
          ]}
          onPress={() => setShowCustomModal(true)}
        >
          <View style={styles.customOptionContent}>
            <Icon name="add-circle-outline" size={16} color={isCustomValue ? colors.background : colors.primary} />
            <Text
              style={[
                styles.optionText,
                styles.customOptionText,
                isCustomValue && styles.selectedOptionText,
              ]}
            >
              {isCustomValue ? getCustomLabel(value) : 'Custom'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCustomModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCustomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Custom Warranty Length</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.customInput}
                value={customValue}
                onChangeText={setCustomValue}
                placeholder="Enter number"
                keyboardType="numeric"
                autoFocus
              />
              
              <View style={styles.unitSelector}>
                <TouchableOpacity
                  style={[
                    styles.unitOption,
                    customUnit === 'months' && styles.selectedUnitOption,
                  ]}
                  onPress={() => setCustomUnit('months')}
                >
                  <Text
                    style={[
                      styles.unitText,
                      customUnit === 'months' && styles.selectedUnitText,
                    ]}
                  >
                    Months
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.unitOption,
                    customUnit === 'years' && styles.selectedUnitOption,
                  ]}
                  onPress={() => setCustomUnit('years')}
                >
                  <Text
                    style={[
                      styles.unitText,
                      customUnit === 'years' && styles.selectedUnitText,
                    ]}
                  >
                    Years
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowCustomModal(false);
                  setCustomValue('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleCustomSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grey,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.background,
  },
  customOption: {
    borderStyle: 'dashed',
  },
  customOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  customOptionText: {
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  customInput: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
    marginBottom: 12,
  },
  unitSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  unitOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grey,
    alignItems: 'center',
  },
  selectedUnitOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedUnitText: {
    color: colors.background,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.grey,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: '500',
  },
  saveButtonText: {
    color: colors.background,
    fontWeight: '500',
  },
});
