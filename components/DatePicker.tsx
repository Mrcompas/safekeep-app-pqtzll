
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label: string;
}

export default function DatePicker({ value, onChange, label }: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[commonStyles.textSecondary, { marginBottom: 8, fontSize: 16, fontWeight: '500' }]}>
        {label}
      </Text>
      <TouchableOpacity
        style={[
          commonStyles.input,
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 0,
          }
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={{ fontSize: 16, color: colors.text }}>
          {formatDate(value)}
        </Text>
        <Icon name="calendar" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}
