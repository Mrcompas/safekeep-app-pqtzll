
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors } from '../styles/commonStyles';
import Icon from '../components/Icon';

export default function AddScreen() {
  console.log('AddScreen rendered');

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <View style={commonStyles.emptyState}>
          <Icon 
            name="add-circle" 
            size={80} 
            color={colors.accent}
            style={{ marginBottom: 24 }}
          />
          <Text style={commonStyles.emptyStateText}>
            Add New Item
          </Text>
          <Text style={commonStyles.emptyStateSubtext}>
            Quickly add products and their warranty information to keep track of your valuable items.
          </Text>
          
          <View style={[commonStyles.card, { marginTop: 32, width: '100%' }]}>
            <View style={[commonStyles.row, { marginBottom: 16 }]}>
              <Icon name="document-text" size={24} color={colors.primary} />
              <Text style={[commonStyles.subtitle, { marginBottom: 0, marginLeft: 12 }]}>
                Manual Entry
              </Text>
            </View>
            <Text style={commonStyles.textSecondary}>
              Add items by entering product details manually. Perfect for when you have the warranty information ready.
            </Text>
          </View>

          <View style={[commonStyles.card, { width: '100%' }]}>
            <View style={[commonStyles.row, { marginBottom: 16 }]}>
              <Icon name="camera" size={24} color={colors.accent} />
              <Text style={[commonStyles.subtitle, { marginBottom: 0, marginLeft: 12 }]}>
                Receipt Scanning
              </Text>
            </View>
            <Text style={commonStyles.textSecondary}>
              Coming soon: Scan receipts with your camera to automatically extract product and warranty information.
            </Text>
          </View>

          <View style={[commonStyles.card, { width: '100%' }]}>
            <View style={[commonStyles.row, { marginBottom: 16 }]}>
              <Icon name="flash" size={24} color={colors.warning} />
              <Text style={[commonStyles.subtitle, { marginBottom: 0, marginLeft: 12 }]}>
                Quick Add Features
              </Text>
            </View>
            <Text style={commonStyles.textSecondary}>
              • Product name and category{'\n'}
              • Purchase date selection{'\n'}
              • Warranty duration{'\n'}
              • Optional notes and price{'\n'}
              • Photo attachments
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
