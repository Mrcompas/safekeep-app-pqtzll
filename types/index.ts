
export interface WarrantyItem {
  id: string;
  name: string;
  purchaseDate: Date;
  warrantyDuration: number; // in months
  category?: string;
  notes?: string;
  price?: number;
}

export interface WarrantyStatus {
  isActive: boolean;
  daysRemaining: number;
  expirationDate: Date;
  status: 'active' | 'expiring' | 'expired';
}

export type WarrantyItemWithStatus = WarrantyItem & {
  status: WarrantyStatus;
};
