import type { SupplierRow } from '../data-access/suppliers/suppliers.models';

export interface SupplierDialogDraft {
  id: number;
  name: string;
  link: string;
  contactPerson: string;
  phoneNumber: string;
}

export interface SupplierDialogData {
  mode: 'create' | 'edit';
  draft: SupplierDialogDraft;
}

export interface SupplierDialogResult {
  originalId: number | null;
  draft: SupplierDialogDraft;
}

export interface GarmentPartDialogDraft {
  id: number;
  name: string;
  supplierId: number;
  contactPerson: string;
  phoneNumber: string;
}

export interface GarmentPartDialogData {
  mode: 'create' | 'edit';
  draft: GarmentPartDialogDraft;
  suppliers: SupplierRow[];
}

export interface GarmentPartDialogResult {
  originalId: number | null;
  draft: GarmentPartDialogDraft;
}

export interface FabricDialogDraft {
  id: number;
  name: string;
  price: number | null;
  providerName: string;
}

export interface FabricDialogData {
  mode: 'create' | 'edit';
  draft: FabricDialogDraft;
  suppliers: SupplierRow[];
}

export interface FabricDialogResult {
  originalId: number | null;
  draft: FabricDialogDraft;
}

export interface GarmentAccessoryDialogDraft {
  id: number;
  name: string;
  price: number | null;
}

export interface GarmentAccessoryDialogData {
  mode: 'create' | 'edit';
  draft: GarmentAccessoryDialogDraft;
}

export interface GarmentAccessoryDialogResult {
  originalId: number | null;
  draft: GarmentAccessoryDialogDraft;
}
