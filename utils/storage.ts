
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from '../types/item';

const ITEMS_STORAGE_KEY = 'safekeep_items';

export const saveItem = async (item: Item): Promise<void> => {
  try {
    const existingItems = await getItems();
    const updatedItems = [...existingItems, item];
    await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(updatedItems));
    console.log('Item saved successfully:', item.id);
  } catch (error) {
    console.error('Error saving item:', error);
    throw error;
  }
};

export const getItems = async (): Promise<Item[]> => {
  try {
    const itemsJson = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
    if (itemsJson) {
      const items = JSON.parse(itemsJson);
      // Convert date strings back to Date objects
      return items.map((item: any) => ({
        ...item,
        purchaseDate: new Date(item.purchaseDate),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting items:', error);
    return [];
  }
};

export const updateItem = async (updatedItem: Item): Promise<void> => {
  try {
    const existingItems = await getItems();
    const itemIndex = existingItems.findIndex(item => item.id === updatedItem.id);
    if (itemIndex !== -1) {
      existingItems[itemIndex] = updatedItem;
      await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(existingItems));
      console.log('Item updated successfully:', updatedItem.id);
    }
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

export const deleteItem = async (itemId: string): Promise<void> => {
  try {
    const existingItems = await getItems();
    const filteredItems = existingItems.filter(item => item.id !== itemId);
    await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(filteredItems));
    console.log('Item deleted successfully:', itemId);
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};
