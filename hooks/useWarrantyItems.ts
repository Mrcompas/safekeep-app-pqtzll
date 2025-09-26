
import { useState, useEffect } from 'react';
import { WarrantyItem, WarrantyItemWithStatus } from '../types';
import { calculateWarrantyStatus } from '../utils/warrantyUtils';

// Mock data for initial development
const mockItems: WarrantyItem[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    purchaseDate: new Date('2023-10-01'),
    warrantyDuration: 12,
    category: 'Electronics',
    price: 999,
    notes: 'AppleCare+ included',
  },
  {
    id: '2',
    name: 'Samsung Washing Machine',
    purchaseDate: new Date('2023-01-15'),
    warrantyDuration: 24,
    category: 'Appliances',
    price: 799,
  },
  {
    id: '3',
    name: 'Nike Air Max',
    purchaseDate: new Date('2024-01-01'),
    warrantyDuration: 6,
    category: 'Footwear',
    price: 150,
  },
];

export const useWarrantyItems = () => {
  const [items, setItems] = useState<WarrantyItem[]>(mockItems);
  const [loading, setLoading] = useState(false);

  const itemsWithStatus: WarrantyItemWithStatus[] = items.map(item => ({
    ...item,
    status: calculateWarrantyStatus(item),
  }));

  const addItem = (item: Omit<WarrantyItem, 'id'>) => {
    const newItem: WarrantyItem = {
      ...item,
      id: Date.now().toString(),
    };
    setItems(prev => [...prev, newItem]);
    console.log('Added new warranty item:', newItem.name);
  };

  const updateItem = (id: string, updates: Partial<WarrantyItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    console.log('Updated warranty item:', id);
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    console.log('Deleted warranty item:', id);
  };

  const getItemById = (id: string): WarrantyItemWithStatus | undefined => {
    return itemsWithStatus.find(item => item.id === id);
  };

  // Sort items by warranty status (expiring first, then active, then expired)
  const sortedItems = itemsWithStatus.sort((a, b) => {
    if (a.status.status === 'expiring' && b.status.status !== 'expiring') return -1;
    if (b.status.status === 'expiring' && a.status.status !== 'expiring') return 1;
    if (a.status.status === 'active' && b.status.status === 'expired') return -1;
    if (b.status.status === 'active' && a.status.status === 'expired') return 1;
    return b.status.daysRemaining - a.status.daysRemaining;
  });

  return {
    items: sortedItems,
    loading,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
  };
};
