
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
}

export interface ItemFormData {
  productName: string;
  purchaseDate: Date;
  warrantyLength: number;
  storeName: string;
  receiptImageUri?: string;
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
