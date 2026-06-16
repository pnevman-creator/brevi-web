export interface SupplierRow {
  id: number;
  name: string;
  link: string;
}

export interface CreateSupplierRequest {
  id: number;
  name: string;
  link: string;
}

export interface UpdateSupplierRequest {
  name: string;
  link: string;
}
