
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from '../types/item';

const ITEMS_STORAGE_KEY = 'warranty_items';

export const getItems = async (): Promise<Item[]> => {
  try {
    console.log('Getting items from storage...');
    const jsonValue = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
    const items = jsonValue != null ? JSON.parse(jsonValue) : [];
    
    // Convert date strings back to Date objects
    const parsedItems = items.map((item: any) => ({
      ...item,
      purchaseDate: new Date(item.purchaseDate),
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));
    
    console.log('Retrieved items from storage:', parsedItems.length);
    return parsedItems;
  } catch (error) {
    console.error('Error getting items from storage:', error);
    return [];
  }
};

export const saveItem = async (item: Item): Promise<void> => {
  try {
    console.log('Saving item to storage:', item.productName);
    const existingItems = await getItems();
    const updatedItems = [...existingItems, item];
    const jsonValue = JSON.stringify(updatedItems);
    await AsyncStorage.setItem(ITEMS_STORAGE_KEY, jsonValue);
    console.log('Item saved to storage successfully');
  } catch (error) {
    console.error('Error saving item to storage:', error);
    throw error;
  }
};

export const updateItem = async (updatedItem: Item): Promise<void> => {
  try {
    console.log('Updating item in storage:', updatedItem.id);
    const existingItems = await getItems();
    const itemIndex = existingItems.findIndex(item => item.id === updatedItem.id);
    
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }
    
    existingItems[itemIndex] = {
      ...updatedItem,
      updatedAt: new Date(),
    };
    
    const jsonValue = JSON.stringify(existingItems);
    await AsyncStorage.setItem(ITEMS_STORAGE_KEY, jsonValue);
    console.log('Item updated in storage successfully');
  } catch (error) {
    console.error('Error updating item in storage:', error);
    throw error;
  }
};

export const deleteItem = async (itemId: string): Promise<void> => {
  try {
    console.log('Deleting item from storage:', itemId);
    const existingItems = await getItems();
    const filteredItems = existingItems.filter(item => item.id !== itemId);
    
    if (filteredItems.length === existingItems.length) {
      throw new Error('Item not found');
    }
    
    const jsonValue = JSON.stringify(filteredItems);
    await AsyncStorage.setItem(ITEMS_STORAGE_KEY, jsonValue);
    console.log('Item deleted from storage successfully');
  } catch (error) {
    console.error('Error deleting item from storage:', error);
    throw error;
  }
};

export const clearAllItems = async (): Promise<void> => {
  try {
    console.log('Clearing all items from storage...');
    await AsyncStorage.removeItem(ITEMS_STORAGE_KEY);
    console.log('All items cleared from storage successfully');
  } catch (error) {
    console.error('Error clearing items from storage:', error);
    throw error;
  }
};
