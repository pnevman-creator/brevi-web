export interface GarmentPartRow {
  id: number;
  name: string;
}

export interface CreateGarmentPartRequest {
  id: number;
  name: string;
}

export interface UpdateGarmentPartRequest {
  name: string;
}
