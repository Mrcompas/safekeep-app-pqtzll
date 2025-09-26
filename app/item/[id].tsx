
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { useWarrantyItems } from '../../hooks/useWarrantyItems';
import { getStatusColor, getStatusText, formatDate } from '../../utils/warrantyUtils';
import Icon from '../../components/Icon';

export default function ItemDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getItemById, deleteItem } = useWarrantyItems();

  const item = getItemById(id!);

  if (!item) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, commonStyles.center]}>
          <Text style={commonStyles.text}>Item not found</Text>
          <TouchableOpacity 
            style={buttonStyles.primary}
            onPress={() => router.back()}
          >
            <Text style={buttonStyles.text}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = getStatusColor(item.status.status);
  const statusText = getStatusText(item.status);

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteItem(item.id);
            router.back();
          },
        },
      ]
    );
  };

  const progressPercentage = Math.max(0, Math.min(100, 
    ((item.warrantyDuration * 30 - Math.abs(item.status.daysRemaining)) / (item.warrantyDuration * 30)) * 100
  ));

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
          <Text style={commonStyles.title}>Item Details</Text>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Icon name="trash-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Status Card */}
          <View style={[commonStyles.card, styles.statusCard]}>
            <View style={styles.statusHeader}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.statusBadgeText}>
                  {item.status.status.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusText}
            </Text>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${progressPercentage}%`,
                      backgroundColor: statusColor 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {progressPercentage.toFixed(0)}% of warranty used
              </Text>
            </View>
          </View>

          {/* Details */}
          <View style={commonStyles.card}>
            <Text style={styles.sectionTitle}>Details</Text>
            
            <View style={styles.detailRow}>
              <Icon name="calendar-outline" size={20} color={colors.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Purchase Date</Text>
                <Text style={styles.detailValue}>
                  {formatDate(item.purchaseDate)}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Icon name="time-outline" size={20} color={colors.textSecondary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Warranty Duration</Text>
                <Text style={styles.detailValue}>
                  {item.warrantyDuration} months
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Icon name="shield-checkmark-outline" size={20} color={statusColor} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Warranty Expires</Text>
                <Text style={styles.detailValue}>
                  {formatDate(item.status.expirationDate)}
                </Text>
              </View>
            </View>

            {item.category && (
              <View style={styles.detailRow}>
                <Icon name="pricetag-outline" size={20} color={colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>{item.category}</Text>
                </View>
              </View>
            )}

            {item.price && (
              <View style={styles.detailRow}>
                <Icon name="card-outline" size={20} color={colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Price</Text>
                  <Text style={styles.detailValue}>${item.price.toFixed(2)}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Notes */}
          {item.notes && (
            <View style={commonStyles.card}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={styles.notesText}>{item.notes}</Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[buttonStyles.secondary, styles.actionButton]}
              onPress={() => {
                console.log('Edit functionality not implemented yet');
                Alert.alert('Coming Soon', 'Edit functionality will be available in a future update.');
              }}
            >
              <Icon name="create-outline" size={20} color={colors.text} />
              <Text style={[buttonStyles.textSecondary, { marginLeft: 8 }]}>
                Edit Item
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[buttonStyles.secondary, styles.actionButton, { borderColor: colors.error }]}
              onPress={handleDelete}
            >
              <Icon name="trash-outline" size={20} color={colors.error} />
              <Text style={[buttonStyles.textSecondary, { marginLeft: 8, color: colors.error }]}>
                Delete Item
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.backgroundAlt,
  },
  content: {
    flex: 1,
  },
  statusCard: {
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.background,
    letterSpacing: 0.5,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 4,
    overflow: 'hidden' as const,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center' as const,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text,
  },
  notesText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  actionsContainer: {
    marginTop: 16,
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
};
