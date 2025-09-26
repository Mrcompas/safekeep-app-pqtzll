
import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface ReceiptThumbnailProps {
  imageUri: string;
  size?: number;
  onPress?: () => void;
}

export default function ReceiptThumbnail({ 
  imageUri, 
  size = 50, 
  onPress 
}: ReceiptThumbnailProps) {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component onPress={onPress}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: imageUri }}
          style={{
            width: size,
            height: size,
            borderRadius: 8,
            backgroundColor: colors.backgroundAlt,
          }}
          resizeMode="cover"
        />
        <View style={{
          position: 'absolute',
          bottom: -4,
          right: -4,
          backgroundColor: colors.primary,
          borderRadius: 8,
          padding: 2,
        }}>
          <Icon name="receipt" size={size * 0.24} color={colors.background} />
        </View>
      </View>
    </Component>
  );
}
