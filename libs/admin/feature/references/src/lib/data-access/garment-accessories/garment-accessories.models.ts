export interface GarmentAccessoryRow {
  id: number;
  name: string;
  price: number;
}

export interface CreateGarmentAccessoryRequest {
  id: number;
  name: string;
  price: number;
}

export interface UpdateGarmentAccessoryRequest {
  name: string;
  price: number;
}
