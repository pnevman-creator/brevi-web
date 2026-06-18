export interface AdditionalReferenceDialogDraft {
  id: number;
  name: string;
  key: string;
  value: number | null;
  unit: string;
  description: string;
}

export interface AdditionalReferenceDialogData {
  mode: 'create' | 'edit';
  draft: AdditionalReferenceDialogDraft;
}

export interface AdditionalReferenceDialogResult {
  originalId: number | null;
  draft: AdditionalReferenceDialogDraft;
}
