
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item, User } from '../types/item';

const ITEMS_STORAGE_KEY = 'warranty_items';
const USER_STORAGE_KEY = 'current_user';
const USERS_STORAGE_KEY = 'registered_users';

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

// User Authentication Functions
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_STORAGE_KEY);
    if (jsonValue) {
      const user = JSON.parse(jsonValue);
      return {
        ...user,
        createdAt: new Date(user.createdAt),
        lastLoginAt: new Date(user.lastLoginAt),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const setCurrentUser = async (user: User | null): Promise<void> => {
  try {
    if (user) {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error setting current user:', error);
    throw error;
  }
};

export const getRegisteredUsers = async (): Promise<User[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    if (jsonValue) {
      const users = JSON.parse(jsonValue);
      return users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLoginAt: new Date(user.lastLoginAt),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting registered users:', error);
    return [];
  }
};

export const saveUser = async (user: User): Promise<void> => {
  try {
    const users = await getRegisteredUsers();
    const existingUserIndex = users.findIndex(u => u.email === user.email);
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user;
    } else {
      users.push(user);
    }
    
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const users = await getRegisteredUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

// User-specific item functions
export const getUserItems = async (userId: string): Promise<Item[]> => {
  try {
    const allItems = await getItems();
    return allItems.filter(item => item.userId === userId);
  } catch (error) {
    console.error('Error getting user items:', error);
    return [];
  }
};

export const migrateLocalItemsToUser = async (userId: string): Promise<void> => {
  try {
    console.log('Migrating local items to user:', userId);
    const allItems = await getItems();
    const localItems = allItems.filter(item => !item.userId);
    
    if (localItems.length > 0) {
      const updatedItems = allItems.map(item => 
        !item.userId ? { ...item, userId, updatedAt: new Date() } : item
      );
      
      await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(updatedItems));
      console.log(`Migrated ${localItems.length} items to user ${userId}`);
    }
  } catch (error) {
    console.error('Error migrating local items to user:', error);
    throw error;
  }
};
