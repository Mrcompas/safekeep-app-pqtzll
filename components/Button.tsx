
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../styles/commonStyles';

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  disabled?: boolean;
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.grey,
  },
  text: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  textDisabled: {
    color: colors.textSecondary,
  },
});

export default function Button({ text, onPress, style, textStyle, disabled = false }: ButtonProps) {
  console.log('Button rendered:', text);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.text,
        disabled && styles.textDisabled,
        textStyle,
      ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
