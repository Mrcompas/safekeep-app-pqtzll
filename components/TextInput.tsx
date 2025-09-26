
import React from 'react';
import { View, Text, TextInput as RNTextInput, TextInputProps } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function TextInput({ label, error, style, ...props }: CustomTextInputProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[commonStyles.textSecondary, { marginBottom: 8, fontSize: 16, fontWeight: '500' }]}>
        {label}
      </Text>
      <RNTextInput
        style={[
          commonStyles.input,
          { marginBottom: 0 },
          error && { borderColor: colors.error },
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && (
        <Text style={{ color: colors.error, fontSize: 14, marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
}
