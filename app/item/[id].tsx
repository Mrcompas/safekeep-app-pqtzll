
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useWarrantyItems } from '../../hooks/useWarrantyItems';
import { calculateItemWarrantyStatus, getDaysRemainingText, formatDate } from '../../utils/warrantyUtils';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import Icon from '../../components/Icon';

export default function ItemDetailsScreen() {
  console.log('ItemDetailsScreen rendered');

  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { items, deleteItem } = useWarrantyItems();

  const item = items.find(item => item.id === id);

  if (!item) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, commonStyles.center]}>
          <Icon name="alert-circle" size={60} color={colors.error} style={{ marginBottom: 16 }} />
          <Text style={commonStyles.emptyStateText}>Item Not Found</Text>
          <Text style={commonStyles.emptyStateSubtext}>
            The item you're looking for doesn't exist or may have been deleted.
          </Text>
          <TouchableOpacity
            style={[buttonStyles.primary, { marginTop: 24 }]}
            onPress={() => router.back()}
          >
            <Text style={buttonStyles.text}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const warranty = calculateItemWarrantyStatus(item.purchaseDate, item.warrantyLength);

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.productName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(item.id);
              router.back();
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderStatusSection = () => {
    return (
      <View style={commonStyles.card}>
        <View style={[commonStyles.row, { marginBottom: 16 }]}>
          <Text style={commonStyles.subtitle}>Warranty Status</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: warranty.color,
                marginRight: 8,
              }}
            />
            <View style={{
              backgroundColor: warranty.color,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
            }}>
              <Text style={{ color: colors.background, fontSize: 12, fontWeight: '700' }}>
                {warranty.status === 'expired' ? 'EXPIRED' : 
                 warranty.status === 'expiring' ? 'EXPIRING SOON' : 'ACTIVE'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={{ gap: 12 }}>
          <View style={[commonStyles.row]}>
            <Text style={commonStyles.textSecondary}>Days Remaining:</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', color: warranty.color }]}>
              {getDaysRemainingText(warranty.daysLeft)}
            </Text>
          </View>
          
          <View style={[commonStyles.row]}>
            <Text style={commonStyles.textSecondary}>Expires On:</Text>
            <Text style={commonStyles.text}>
              {(() => {
                const expirationDate = new Date(item.purchaseDate);
                expirationDate.setMonth(expirationDate.getMonth() + item.warrantyLength);
                return formatDate(expirationDate);
              })()}
            </Text>
          </View>
          
          <View style={[commonStyles.row]}>
            <Text style={commonStyles.textSecondary}>Warranty Length:</Text>
            <Text style={commonStyles.text}>
              {item.warrantyLength} month{item.warrantyLength !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderDetailsSection = () => {
    return (
      <View style={commonStyles.card}>
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>Product Details</Text>
        
        <View style={{ gap: 12 }}>
          <View style={[commonStyles.row]}>
            <Text style={commonStyles.textSecondary}>Product Name:</Text>
            <Text style={[commonStyles.text, { fontWeight: '600', flex: 1, textAlign: 'right' }]}>
              {item.productName}
            </Text>
          </View>
          
          <View style={[commonStyles.row]}>
            <Text style={commonStyles.textSecondary}>Store:</Text>
            <Text style={[commonStyles.text, { flex: 1, textAlign: 'right' }]}>
              {item.storeName}
            </Text>
          </View>
          
          <View style={[commonStyles.row]}>
            <Text style={commonStyles.textSecondary}>Purchase Date:</Text>
            <Text style={[commonStyles.text, { flex: 1, textAlign: 'right' }]}>
              {formatDate(item.purchaseDate)}
            </Text>
          </View>
          
          <View style={[commonStyles.row]}>
            <Text style={commonStyles.textSecondary}>Added:</Text>
            <Text style={[commonStyles.text, { flex: 1, textAlign: 'right' }]}>
              {formatDate(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: 40 }}>
          {/* Header */}
          <View style={[commonStyles.row, { marginBottom: 24 }]}>
            <TouchableOpacity onPress={() => router.back()}>
              <Icon name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[commonStyles.title, { flex: 1, textAlign: 'center', marginBottom: 0 }]}>
              Item Details
            </Text>
            <TouchableOpacity onPress={handleDelete}>
              <Icon name="trash" size={24} color={colors.error} />
            </TouchableOpacity>
          </View>

          {/* Status Section */}
          {renderStatusSection()}

          {/* Details Section */}
          {renderDetailsSection()}

          {/* Action Buttons */}
          <View style={{ gap: 16, marginTop: 24 }}>
            <TouchableOpacity
              style={[buttonStyles.secondary, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
              onPress={() => {
                Alert.alert(
                  'Edit Item',
                  'Editing functionality will be available in a future update.',
                  [{ text: 'OK' }]
                );
              }}
            >
              <Icon name="create" size={20} color={colors.text} style={{ marginRight: 8 }} />
              <Text style={buttonStyles.textSecondary}>Edit Item</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[buttonStyles.secondary, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}
              onPress={() => {
                Alert.alert(
                  'Share Item',
                  'Sharing functionality will be available in a future update.',
                  [{ text: 'OK' }]
                );
              }}
            >
              <Icon name="share" size={20} color={colors.text} style={{ marginRight: 8 }} />
              <Text style={buttonStyles.textSecondary}>Share Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
