
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { commonStyles, colors } from '../styles/commonStyles';
import { Item } from '../types/item';
import { getItems } from '../utils/storage';
import Icon from '../components/Icon';
import EmptyState from '../components/EmptyState';
import { router } from 'expo-router';

export default function HomeScreen() {
  console.log('HomeScreen rendered');

  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadItems = async () => {
    try {
      console.log('Loading items...');
      const savedItems = await getItems();
      setItems(savedItems);
      console.log('Loaded items:', savedItems.length);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  // Load items when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadItems();
    }, [])
  );

  const getWarrantyStatus = (item: Item) => {
    const warrantyEndDate = new Date(item.purchaseDate);
    warrantyEndDate.setMonth(warrantyEndDate.getMonth() + item.warrantyLength);
    
    const today = new Date();
    const daysLeft = Math.ceil((warrantyEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return { status: 'expired', daysLeft: 0, color: colors.error };
    } else if (daysLeft <= 30) {
      return { status: 'expiring', daysLeft, color: colors.warning };
    } else {
      return { status: 'active', daysLeft, color: colors.success };
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderItem = (item: Item) => {
    const warranty = getWarrantyStatus(item);
    
    return (
      <View key={item.id} style={commonStyles.card}>
        <View style={[commonStyles.row, { alignItems: 'flex-start' }]}>
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 4 }]}>
              {item.productName}
            </Text>
            <Text style={commonStyles.textSecondary}>
              Purchased from {item.storeName}
            </Text>
            <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
              {formatDate(item.purchaseDate)}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={{
              backgroundColor: warranty.color,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              marginBottom: 4,
            }}>
              <Text style={{ color: colors.background, fontSize: 12, fontWeight: '600' }}>
                {warranty.status === 'expired' ? 'Expired' : 
                 warranty.status === 'expiring' ? 'Expiring Soon' : 'Active'}
              </Text>
            </View>
            {warranty.status !== 'expired' && (
              <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                {warranty.daysLeft} days left
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, commonStyles.center]}>
          <Text style={commonStyles.textSecondary}>Loading your items...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView 
        style={commonStyles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {items.length === 0 ? (
          <EmptyState
            title="No Items Yet"
            subtitle="Start by adding your first product to track its warranty information."
            buttonText="Add Your First Item"
            onButtonPress={() => router.push('/add')}
            iconName="add-circle"
          />
        ) : (
          <View>
            <View style={[commonStyles.row, { marginBottom: 24 }]}>
              <Text style={commonStyles.title}>Your Items</Text>
              <Text style={[commonStyles.textSecondary, { fontSize: 16 }]}>
                {items.length} item{items.length !== 1 ? 's' : ''}
              </Text>
            </View>
            
            {items.map(renderItem)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
