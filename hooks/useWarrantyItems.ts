
import { useState, useEffect } from 'react';
import { Item } from '../types/item';
import { getItems, deleteItem as deleteItemFromStorage } from '../utils/storage';
import { calculateItemWarrantyStatus } from '../utils/warrantyUtils';

export const useWarrantyItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    try {
      console.log('Loading warranty items...');
      const storedItems = await getItems();
      setItems(storedItems);
      console.log('Loaded warranty items:', storedItems.length);
    } catch (error) {
      console.error('Error loading warranty items:', error);
    } finally {
      setLoading(false);
    }
  };

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
  }, []);

  return {
    items,
    itemsWithStatus: getItemsWithStatus(),
    loading,
    loadItems,
    deleteItem,
  };
};
