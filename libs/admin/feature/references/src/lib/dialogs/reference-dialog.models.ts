import type { GarmentPartRow } from '../data-access/garment-parts/garment-parts.models';
import type { SupplierRow } from '../data-access/suppliers/suppliers.models';

export interface SupplierDialogDraft {
  id: number;
  name: string;
  link: string;
  contactPerson: string;
  phoneNumber: string;
  notes: string;
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
}

export interface GarmentPartDialogData {
  mode: 'create' | 'edit';
  draft: GarmentPartDialogDraft;
}

export interface GarmentPartDialogResult {
  originalId: number | null;
  draft: GarmentPartDialogDraft;
}

export interface GarmentPartOperationDialogDraft {
  id: number;
  garmentPartName: string;
  name: string;
  min: number | null;
}

export interface GarmentPartOperationDialogData {
  mode: 'create' | 'edit';
  draft: GarmentPartOperationDialogDraft;
  garmentParts: GarmentPartRow[];
}

export interface GarmentPartOperationDialogResult {
  originalId: number | null;
  draft: GarmentPartOperationDialogDraft;
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
  supplierId: number;
}

export interface GarmentAccessoryDialogData {
  mode: 'create' | 'edit';
  draft: GarmentAccessoryDialogDraft;
  suppliers: SupplierRow[];
}

export interface GarmentAccessoryDialogResult {
  originalId: number | null;
  draft: GarmentAccessoryDialogDraft;
}
