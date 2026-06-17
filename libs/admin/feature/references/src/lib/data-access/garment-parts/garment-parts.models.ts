export interface GarmentPartRow {
  id: number;
  name: string;
  supplierId: number;
  supplierName: string;
  contactPerson: string | null;
  phoneNumber: string | null;
}

export interface CreateGarmentPartRequest {
  id: number;
  name: string;
  supplierId: number;
  contactPerson: string | null;
  phoneNumber: string | null;
}

export interface UpdateGarmentPartRequest {
  name: string;
  supplierId: number;
  contactPerson: string | null;
  phoneNumber: string | null;
}
