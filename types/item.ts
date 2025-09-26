
export interface Item {
  id: string;
  productName: string;
  purchaseDate: Date;
  warrantyLength: number; // in months
  storeName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemFormData {
  productName: string;
  purchaseDate: Date;
  warrantyLength: number;
  storeName: string;
}
