
import { useState, useEffect, useCallback } from 'react';
import { Item } from '../types/item';
import { getItems, getUserItems, deleteItem as deleteItemFromStorage } from '../utils/storage';
import { calculateItemWarrantyStatus } from '../utils/warrantyUtils';
import { useAuth } from './useAuth';

export const useWarrantyItems = () => {
  const { authState } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = useCallback(async () => {
    try {
      console.log('Loading warranty items...');
      let storedItems: Item[];
      
      if (authState.isAuthenticated && authState.user) {
        // Load user-specific items if logged in
        storedItems = await getUserItems(authState.user.id);
        console.log('Loaded user items:', storedItems.length);
      } else {
        // Load all items (including local items) if not logged in
        const allItems = await getItems();
        storedItems = allItems.filter(item => !item.userId); // Only show items without userId
        console.log('Loaded local items:', storedItems.length);
      }
      
      setItems(storedItems);
    } catch (error) {
      console.error('Error loading warranty items:', error);
    } finally {
      setLoading(false);
    }
  }, [authState.isAuthenticated, authState.user]);

  const deleteItem = async (itemId: string) => {
    try {
      console.log('Deleting item:', itemId);
      await deleteItemFromStorage(itemId);
      await loadItems(); // Reload items after deletion
      console.log('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  };

  const getItemWithStatus = (item: Item) => {
    const warranty = calculateItemWarrantyStatus(item.purchaseDate, item.warrantyLength);
    return {
      ...item,
      status: {
        isActive: warranty.status !== 'expired',
        daysRemaining: warranty.daysLeft,
        expirationDate: (() => {
          const date = new Date(item.purchaseDate);
          date.setMonth(date.getMonth() + item.warrantyLength);
          return date;
        })(),
        status: warranty.status as 'active' | 'expiring' | 'expired',
      }
    };
  };

  const getItemsWithStatus = () => {
    return items.map(getItemWithStatus);
  };

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return {
    items,
    itemsWithStatus: getItemsWithStatus(),
    loading,
    loadItems,
    deleteItem,
  };
};
