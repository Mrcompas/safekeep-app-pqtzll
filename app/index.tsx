
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { commonStyles, colors } from '../styles/commonStyles';
import { Item } from '../types/item';
import { getItems } from '../utils/storage';
import { calculateItemWarrantyStatus, getDaysRemainingText } from '../utils/warrantyUtils';
import Icon from '../components/Icon';
import EmptyState from '../components/EmptyState';
import { router } from 'expo-router';

export default function HomeScreen() {
  console.log('HomeScreen rendered');

  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadItems = async () => {
    try {
      console.log('Loading items...');
      const savedItems = await getItems();
      setItems(savedItems);
      setFilteredItems(savedItems);
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

  // Filter items based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.storeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  // Load items when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadItems();
    }, [])
  );

  const clearSearch = () => {
    setSearchQuery('');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStatusDot = (status: string, color: string) => {
    return (
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: color,
          marginRight: 8,
        }}
      />
    );
  };

  const renderItem = (item: Item) => {
    const warranty = calculateItemWarrantyStatus(item.purchaseDate, item.warrantyLength);
    
    return (
      <TouchableOpacity
        key={item.id}
        style={commonStyles.card}
        onPress={() => router.push(`/item/${item.id}`)}
      >
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
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              {renderStatusDot(warranty.status, warranty.color)}
              <View style={{
                backgroundColor: warranty.color,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
              }}>
                <Text style={{ color: colors.background, fontSize: 12, fontWeight: '600' }}>
                  {warranty.status === 'expired' ? 'Expired' : 
                   warranty.status === 'expiring' ? 'Expiring Soon' : 'Active'}
                </Text>
              </View>
            </View>
            <Text style={[commonStyles.textSecondary, { fontSize: 12, textAlign: 'right' }]}>
              {getDaysRemainingText(warranty.daysLeft)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSearchBar = () => {
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundAlt,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.grey,
      }}>
        <Icon name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={{
            flex: 1,
            marginLeft: 12,
            fontSize: 16,
            color: colors.text,
          }}
          placeholder="Search by product or store name..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={{ marginLeft: 8 }}>
            <Icon name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderNoResults = () => {
    return (
      <View style={[commonStyles.emptyState, { paddingTop: 60 }]}>
        <Icon 
          name="search" 
          size={60} 
          color={colors.textSecondary}
          style={{ marginBottom: 16 }}
        />
        <Text style={commonStyles.emptyStateText}>
          No Results Found
        </Text>
        <Text style={commonStyles.emptyStateSubtext}>
          Try adjusting your search terms or browse all items below.
        </Text>
        <TouchableOpacity
          style={[commonStyles.card, { marginTop: 20, paddingVertical: 12 }]}
          onPress={clearSearch}
        >
          <Text style={{ color: colors.primary, fontWeight: '600', textAlign: 'center' }}>
            Clear Search
          </Text>
        </TouchableOpacity>
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
            {renderSearchBar()}
            
            {searchQuery.length > 0 && filteredItems.length === 0 ? (
              renderNoResults()
            ) : (
              <>
                <View style={[commonStyles.row, { marginBottom: 24 }]}>
                  <Text style={commonStyles.title}>
                    {searchQuery.length > 0 ? 'Search Results' : 'Your Items'}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { fontSize: 16 }]}>
                    {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
                  </Text>
                </View>
                
                {filteredItems.map(renderItem)}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
