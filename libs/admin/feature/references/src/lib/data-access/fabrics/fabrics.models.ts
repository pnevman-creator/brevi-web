export interface FabricRow {
  id: number;
  name: string;
  price: number;
  providerName: string;
}

export interface CreateFabricRequest {
  id: number;
  name: string;
  price: number;
  providerName: string;
}

export interface UpdateFabricRequest {
  name: string;
  price: number;
  providerName: string;
}
