
import { WarrantyItem, WarrantyStatus } from '../types';
import { colors } from '../styles/commonStyles';

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
      return colors.success; // Green
    case 'expiring':
      return colors.warning; // Orange/Yellow
    case 'expired':
      return colors.error; // Red
    default:
      return colors.textSecondary; // Grey
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

export const getDaysRemainingText = (daysRemaining: number): string => {
  if (daysRemaining <= 0) {
    return `Expired ${Math.abs(daysRemaining)} days ago`;
  } else if (daysRemaining === 1) {
    return '1 day left';
  } else {
    return `${daysRemaining} days left`;
  }
};

// Calculate warranty status for Item type (from existing code)
export const calculateItemWarrantyStatus = (purchaseDate: Date, warrantyLength: number) => {
  const warrantyEndDate = new Date(purchaseDate);
  warrantyEndDate.setMonth(warrantyEndDate.getMonth() + warrantyLength);
  
  const today = new Date();
  const daysLeft = Math.ceil((warrantyEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysLeft < 0) {
    return { status: 'expired', daysLeft: Math.abs(daysLeft), color: colors.error };
  } else if (daysLeft <= 30) {
    return { status: 'expiring', daysLeft, color: colors.warning };
  } else {
    return { status: 'active', daysLeft, color: colors.success };
  }
};
