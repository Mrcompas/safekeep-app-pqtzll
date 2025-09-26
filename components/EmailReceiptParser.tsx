
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { SuggestedItem, EmailReceipt } from '../types/item';
import Icon from './Icon';
import Button from './Button';

interface EmailReceiptParserProps {
  visible: boolean;
  onClose: () => void;
  onItemsSelected: (items: SuggestedItem[]) => void;
}

// Mock data for demonstration
const mockEmailReceipts: EmailReceipt[] = [
  {
    id: '1',
    subject: 'Your Amazon Order Receipt',
    date: new Date('2024-01-15'),
    storeName: 'Amazon',
    productName: 'Wireless Headphones',
    purchaseDate: new Date('2024-01-15'),
    warrantyLength: 12,
    price: 89.99,
    processed: false,
  },
  {
    id: '2',
    subject: 'Best Buy Purchase Confirmation',
    date: new Date('2024-01-10'),
    storeName: 'Best Buy',
    productName: 'Smart TV 55"',
    purchaseDate: new Date('2024-01-10'),
    warrantyLength: 24,
    price: 599.99,
    processed: false,
  },
];

export default function EmailReceiptParser({ visible, onClose, onItemsSelected }: EmailReceiptParserProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [receipts, setReceipts] = useState<EmailReceipt[]>([]);

  const handleConnectEmail = async () => {
    try {
      // In a real app, this would initiate OAuth flow with Gmail/Outlook
      Alert.alert(
        'Email Integration',
        'Email parsing is not yet implemented. This would connect to your Gmail or Outlook account using OAuth to scan for receipts.',
        [
          {
            text: 'Demo Mode',
            onPress: () => {
              setIsConnected(true);
              setReceipts(mockEmailReceipts);
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.log('Error connecting email:', error);
      Alert.alert('Error', 'Failed to connect email account');
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleAddSelectedItems = () => {
    const itemsToAdd: SuggestedItem[] = receipts
      .filter(receipt => selectedItems.includes(receipt.id))
      .map(receipt => ({
        id: receipt.id,
        productName: receipt.productName || 'Unknown Product',
        purchaseDate: receipt.purchaseDate || receipt.date,
        warrantyLength: receipt.warrantyLength || 12,
        storeName: receipt.storeName || 'Unknown Store',
        price: receipt.price,
        source: 'email' as const,
        confidence: 0.8,
      }));

    onItemsSelected(itemsToAdd);
    setSelectedItems([]);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Email Receipts</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          {!isConnected ? (
            <View style={styles.connectContainer}>
              <Icon name="mail" size={64} color={colors.textSecondary} />
              <Text style={styles.connectTitle}>Connect Your Email</Text>
              <Text style={styles.connectDescription}>
                Connect your Gmail or Outlook account to automatically scan for receipts and suggest warranty items.
              </Text>
              
              <View style={styles.providerButtons}>
                <TouchableOpacity style={styles.providerButton} onPress={handleConnectEmail}>
                  <Icon name="logo-google" size={24} color="#DB4437" />
                  <Text style={styles.providerText}>Connect Gmail</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.providerButton} onPress={handleConnectEmail}>
                  <Icon name="mail" size={24} color="#0078D4" />
                  <Text style={styles.providerText}>Connect Outlook</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.privacyNote}>
                🔒 Your email data is processed securely and never stored on our servers.
              </Text>
            </View>
          ) : (
            <View>
              <View style={styles.connectedHeader}>
                <Icon name="checkmark-circle" size={24} color={colors.success} />
                <Text style={styles.connectedText}>Email Connected</Text>
              </View>

              <Text style={styles.sectionTitle}>Suggested Items from Receipts</Text>

              {receipts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Icon name="document-text" size={48} color={colors.textSecondary} />
                  <Text style={styles.emptyTitle}>No Receipts Found</Text>
                  <Text style={styles.emptyDescription}>
                    We couldn't find any purchase receipts in your recent emails.
                  </Text>
                </View>
              ) : (
                <>
                  {receipts.map(receipt => (
                    <TouchableOpacity
                      key={receipt.id}
                      style={[
                        styles.receiptCard,
                        selectedItems.includes(receipt.id) && styles.selectedReceiptCard
                      ]}
                      onPress={() => toggleItemSelection(receipt.id)}
                    >
                      <View style={styles.receiptHeader}>
                        <View style={styles.receiptIcon}>
                          <Icon 
                            name={selectedItems.includes(receipt.id) ? "checkmark-circle" : "circle-outline"} 
                            size={24} 
                            color={selectedItems.includes(receipt.id) ? colors.primary : colors.textSecondary} 
                          />
                        </View>
                        <View style={styles.receiptInfo}>
                          <Text style={styles.receiptProduct}>{receipt.productName}</Text>
                          <Text style={styles.receiptStore}>{receipt.storeName}</Text>
                        </View>
                        <View style={styles.receiptMeta}>
                          <Text style={styles.receiptPrice}>
                            {receipt.price ? `$${receipt.price.toFixed(2)}` : ''}
                          </Text>
                          <Text style={styles.receiptDate}>
                            {receipt.purchaseDate?.toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.receiptDetails}>
                        <Text style={styles.receiptWarranty}>
                          Warranty: {receipt.warrantyLength} months
                        </Text>
                        <Text style={styles.receiptSource}>
                          From: {receipt.subject}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}

                  {selectedItems.length > 0 && (
                    <View style={styles.actionButtons}>
                      <Button
                        title={`Add ${selectedItems.length} Item${selectedItems.length > 1 ? 's' : ''}`}
                        onPress={handleAddSelectedItems}
                        style={styles.addButton}
                      />
                    </View>
                  )}
                </>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  connectContainer: {
    alignItems: 'center' as const,
    paddingVertical: 40,
  },
  connectTitle: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  connectDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center' as const,
    marginBottom: 32,
    lineHeight: 24,
  },
  providerButtons: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  providerButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 12,
    backgroundColor: colors.background,
    gap: 12,
  },
  providerText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text,
  },
  privacyNote: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center' as const,
    fontStyle: 'italic' as const,
  },
  connectedHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 24,
    gap: 8,
  },
  connectedText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.success,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center' as const,
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center' as const,
  },
  receiptCard: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedReceiptCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  receiptHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  receiptIcon: {
    marginRight: 12,
  },
  receiptInfo: {
    flex: 1,
  },
  receiptProduct: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  receiptStore: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  receiptMeta: {
    alignItems: 'flex-end' as const,
  },
  receiptPrice: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  receiptDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  receiptDetails: {
    paddingLeft: 36,
  },
  receiptWarranty: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  receiptSource: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic' as const,
  },
  actionButtons: {
    marginTop: 20,
  },
  addButton: {
    backgroundColor: colors.primary,
  },
};
