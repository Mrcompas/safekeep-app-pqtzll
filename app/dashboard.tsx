
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { colors, commonStyles } from '../styles/commonStyles';
import { useWarrantyItems } from '../hooks/useWarrantyItems';
import { calculateItemWarrantyStatus } from '../utils/warrantyUtils';
import Icon from '../components/Icon';

const screenWidth = Dimensions.get('window').width;

interface AnalyticsData {
  active: number;
  expiring: number;
  expired: number;
  totalValue: number;
}

export default function DashboardScreen() {
  const { items } = useWarrantyItems();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    active: 0,
    expiring: 0,
    expired: 0,
    totalValue: 0,
  });

  const calculateAnalytics = useCallback(() => {
    let active = 0;
    let expiring = 0;
    let expired = 0;
    let totalValue = 0;

    items.forEach(item => {
      const status = calculateItemWarrantyStatus(item.purchaseDate, item.warrantyLength);
      
      switch (status.status) {
        case 'active':
          active++;
          break;
        case 'expiring':
          expiring++;
          break;
        case 'expired':
          expired++;
          break;
      }

      // Add to total value if item has a price (optional feature)
      if (item.price) {
        totalValue += item.price;
      }
    });

    setAnalytics({ active, expiring, expired, totalValue });
  }, [items]);

  useEffect(() => {
    calculateAnalytics();
  }, [calculateAnalytics]);

  const pieData = [
    {
      name: 'Active',
      population: analytics.active,
      color: colors.success,
      legendFontColor: colors.text,
      legendFontSize: 14,
    },
    {
      name: 'Expiring',
      population: analytics.expiring,
      color: colors.warning,
      legendFontColor: colors.text,
      legendFontSize: 14,
    },
    {
      name: 'Expired',
      population: analytics.expired,
      color: colors.error,
      legendFontColor: colors.text,
      legendFontSize: 14,
    },
  ].filter(item => item.population > 0);

  const barData = {
    labels: ['Active', 'Expiring', 'Expired'],
    datasets: [
      {
        data: [analytics.active, analytics.expiring, analytics.expired],
        colors: [
          () => colors.success,
          () => colors.warning,
          () => colors.error,
        ],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.background,
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => colors.text,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: '500',
    },
  };

  const totalItems = analytics.active + analytics.expiring + analytics.expired;

  return (
    <SafeAreaView style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20 }}>
          <Text style={[commonStyles.title, { marginBottom: 24 }]}>
            Analytics Dashboard
          </Text>

          {/* Summary Cards */}
          <View style={styles.summaryContainer}>
            <View style={[styles.summaryCard, { backgroundColor: colors.success + '20' }]}>
              <Icon name="shield-checkmark" size={24} color={colors.success} />
              <Text style={[styles.summaryNumber, { color: colors.success }]}>
                {analytics.active}
              </Text>
              <Text style={styles.summaryLabel}>Active</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: colors.warning + '20' }]}>
              <Icon name="warning" size={24} color={colors.warning} />
              <Text style={[styles.summaryNumber, { color: colors.warning }]}>
                {analytics.expiring}
              </Text>
              <Text style={styles.summaryLabel}>Expiring Soon</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: colors.error + '20' }]}>
              <Icon name="close-circle" size={24} color={colors.error} />
              <Text style={[styles.summaryNumber, { color: colors.error }]}>
                {analytics.expired}
              </Text>
              <Text style={styles.summaryLabel}>Expired</Text>
            </View>
          </View>

          {/* Total Items */}
          <View style={styles.totalCard}>
            <Text style={styles.totalNumber}>{totalItems}</Text>
            <Text style={styles.totalLabel}>Total Items Tracked</Text>
          </View>

          {/* Charts */}
          {totalItems > 0 && (
            <>
              {/* Pie Chart */}
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Warranty Status Distribution</Text>
                <PieChart
                  data={pieData}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  center={[10, 10]}
                  absolute
                />
              </View>

              {/* Bar Chart */}
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Items by Status</Text>
                <BarChart
                  data={barData}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={chartConfig}
                  verticalLabelRotation={0}
                  showValuesOnTopOfBars
                  fromZero
                  withCustomBarColorFromData
                  flatColor
                />
              </View>

              {/* Value Summary (if prices are tracked) */}
              {analytics.totalValue > 0 && (
                <View style={styles.valueCard}>
                  <Icon name="cash" size={24} color={colors.primary} />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.valueAmount}>
                      ${analytics.totalValue.toFixed(2)}
                    </Text>
                    <Text style={styles.valueLabel}>Total Value Covered</Text>
                  </View>
                </View>
              )}
            </>
          )}

          {totalItems === 0 && (
            <View style={styles.emptyState}>
              <Icon name="analytics" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyTitle}>No Data Yet</Text>
              <Text style={styles.emptyMessage}>
                Add some warranty items to see your analytics
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  summaryContainer: {
    flexDirection: 'row' as const,
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center' as const,
    gap: 8,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  totalCard: {
    backgroundColor: colors.primary + '10',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center' as const,
    marginBottom: 24,
  },
  totalNumber: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center' as const,
  },
  valueCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.primary + '10',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  valueAmount: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  valueLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center' as const,
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center' as const,
  },
};
