
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WarrantyItemWithStatus } from '../types';
import { colors, commonStyles } from '../styles/commonStyles';
import { getStatusColor, getStatusText, formatDate } from '../utils/warrantyUtils';
import Icon from './Icon';

interface WarrantyCardProps {
  item: WarrantyItemWithStatus;
  onPress: () => void;
}

const WarrantyCard: React.FC<WarrantyCardProps> = ({ item, onPress }) => {
  const statusColor = getStatusColor(item.status.status);
  const statusText = getStatusText(item.status);

  return (
    <TouchableOpacity style={[commonStyles.card, styles.card]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.category && (
            <Text style={commonStyles.textSecondary}>{item.category}</Text>
          )}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{item.status.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Icon name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>
            Purchased: {formatDate(item.purchaseDate)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="shield-checkmark-outline" size={16} color={statusColor} />
          <Text style={[styles.detailText, { color: statusColor }]}>
            {statusText}
          </Text>
        </View>
        
        {item.price && (
          <View style={styles.detailRow}>
            <Icon name="pricetag-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              ${item.price.toFixed(2)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.background,
    letterSpacing: 0.5,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default WarrantyCard;
