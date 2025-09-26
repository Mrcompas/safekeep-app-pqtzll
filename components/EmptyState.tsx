
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonPress: () => void;
  iconName?: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  buttonText,
  onButtonPress,
  iconName = 'shield-outline',
}) => {
  return (
    <View style={commonStyles.emptyState}>
      <Icon name={iconName} size={64} color={colors.textSecondary} />
      <Text style={commonStyles.emptyStateText}>{title}</Text>
      <Text style={commonStyles.emptyStateSubtext}>{subtitle}</Text>
      <TouchableOpacity style={buttonStyles.primary} onPress={onButtonPress}>
        <Text style={buttonStyles.text}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyState;
