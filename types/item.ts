
export interface Item {
  id: string;
  productName: string;
  purchaseDate: Date;
  warrantyLength: number; // in months
  storeName: string;
  receiptImageUri?: string; // New field for receipt photo
  userId?: string; // New field for user association
  createdAt: Date;
  updatedAt: Date;
  price?: number; // Optional price field for analytics
  barcode?: string; // Optional barcode field
}

export interface ItemFormData {
  productName: string;
  purchaseDate: Date;
  warrantyLength: number;
  storeName: string;
  receiptImageUri?: string;
  price?: number;
  barcode?: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  thirtyDayAlert: boolean;
  sevenDayAlert: boolean;
  expirationDayAlert: boolean;
}

export interface EmailReceipt {
  id: string;
  subject: string;
  date: Date;
  storeName?: string;
  productName?: string;
  purchaseDate?: Date;
  warrantyLength?: number;
  price?: number;
  processed: boolean;
}

export interface SuggestedItem {
  id: string;
  productName: string;
  purchaseDate: Date;
  warrantyLength: number;
  storeName: string;
  price?: number;
  source: 'email' | 'barcode';
  confidence: number;
}

export interface BackupData {
  items: Item[];
  exportDate: Date;
  version: string;
}
