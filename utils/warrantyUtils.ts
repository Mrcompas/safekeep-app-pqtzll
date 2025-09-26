
import { WarrantyItem, WarrantyStatus } from '../types';

export const calculateWarrantyStatus = (item: WarrantyItem): WarrantyStatus => {
  const purchaseDate = new Date(item.purchaseDate);
  const expirationDate = new Date(purchaseDate);
  expirationDate.setMonth(expirationDate.getMonth() + item.warrantyDuration);
  
  const today = new Date();
  const timeDiff = expirationDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  const isActive = daysRemaining > 0;
  
  let status: 'active' | 'expiring' | 'expired';
  if (daysRemaining <= 0) {
    status = 'expired';
  } else if (daysRemaining <= 30) {
    status = 'expiring';
  } else {
    status = 'active';
  }
  
  return {
    isActive,
    daysRemaining,
    expirationDate,
    status,
  };
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusColor = (status: 'active' | 'expiring' | 'expired'): string => {
  switch (status) {
    case 'active':
      return '#4CAF50'; // Green
    case 'expiring':
      return '#FF9800'; // Orange
    case 'expired':
      return '#F44336'; // Red
    default:
      return '#757575'; // Grey
  }
};

export const getStatusText = (status: WarrantyStatus): string => {
  if (status.status === 'expired') {
    return `Expired ${Math.abs(status.daysRemaining)} days ago`;
  } else if (status.status === 'expiring') {
    return `Expires in ${status.daysRemaining} days`;
  } else {
    return `${status.daysRemaining} days remaining`;
  }
};
