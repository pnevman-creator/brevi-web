export interface GarmentAccessoryRow {
  id: number;
  name: string;
  price: number;
  supplierId: number;
  supplierName: string;
}

export interface CreateGarmentAccessoryRequest {
  id: number;
  name: string;
  price: number;
  supplierName: string;
}

export interface UpdateGarmentAccessoryRequest {
  name: string;
  price: number;
  supplierName: string;
}
