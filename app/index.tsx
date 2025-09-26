
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { useWarrantyItems } from '../hooks/useWarrantyItems';
import WarrantyCard from '../components/WarrantyCard';
import EmptyState from '../components/EmptyState';
import Icon from '../components/Icon';

export default function HomeScreen() {
  const router = useRouter();
  const { items } = useWarrantyItems();

  const activeItems = items.filter(item => item.status.status === 'active');
  const expiringItems = items.filter(item => item.status.status === 'expiring');
  const expiredItems = items.filter(item => item.status.status === 'expired');

  const handleItemPress = (itemId: string) => {
    console.log('Navigating to item details:', itemId);
    router.push(`/item/${itemId}`);
  };

  const handleAddItem = () => {
    console.log('Navigating to add item screen');
    router.push('/add-item');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={commonStyles.title}>SafeKeep</Text>
            <Text style={commonStyles.textSecondary}>
              {items.length} items tracked
            </Text>
          </View>
          <TouchableOpacity 
            style={[buttonStyles.primary, styles.addButton]}
            onPress={handleAddItem}
          >
            <Icon name="add" size={24} color={colors.background} />
          </TouchableOpacity>
        </View>

        {items.length === 0 ? (
          <EmptyState
            title="No warranties tracked yet"
            subtitle="Add your first item to start tracking warranties and never miss an expiration date."
            buttonText="Add Your First Item"
            onButtonPress={handleAddItem}
            iconName="shield-outline"
          />
        ) : (
          <>
            {/* Summary Cards */}
            <View style={styles.summaryContainer}>
              <View style={[styles.summaryCard, { borderLeftColor: colors.success }]}>
                <Text style={styles.summaryNumber}>{activeItems.length}</Text>
                <Text style={styles.summaryLabel}>Active</Text>
              </View>
              <View style={[styles.summaryCard, { borderLeftColor: colors.warning }]}>
                <Text style={styles.summaryNumber}>{expiringItems.length}</Text>
                <Text style={styles.summaryLabel}>Expiring Soon</Text>
              </View>
              <View style={[styles.summaryCard, { borderLeftColor: colors.error }]}>
                <Text style={styles.summaryNumber}>{expiredItems.length}</Text>
                <Text style={styles.summaryLabel}>Expired</Text>
              </View>
            </View>

            {/* Items List */}
            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              {expiringItems.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>⚠️ Expiring Soon</Text>
                  {expiringItems.map(item => (
                    <WarrantyCard
                      key={item.id}
                      item={item}
                      onPress={() => handleItemPress(item.id)}
                    />
                  ))}
                </View>
              )}

              {activeItems.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>✅ Active Warranties</Text>
                  {activeItems.map(item => (
                    <WarrantyCard
                      key={item.id}
                      item={item}
                      onPress={() => handleItemPress(item.id)}
                    />
                  ))}
                </View>
              )}

              {expiredItems.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>❌ Expired</Text>
                  {expiredItems.map(item => (
                    <WarrantyCard
                      key={item.id}
                      item={item}
                      onPress={() => handleItemPress(item.id)}
                    />
                  ))}
                </View>
              )}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 24,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  summaryContainer: {
    flexDirection: 'row' as const,
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
};
