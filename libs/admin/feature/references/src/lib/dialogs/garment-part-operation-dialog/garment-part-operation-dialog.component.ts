import { Component, effect, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import type { GarmentPartRow } from '../../data-access/garment-parts/garment-parts.models';
import type { GarmentPartOperationDialogDraft } from '../reference-dialog.models';

type DialogMode = 'create' | 'edit' | 'view';

const EMPTY_GARMENT_PART_OPERATION_DRAFT: GarmentPartOperationDialogDraft = {
  id: 0,
  garmentPartName: '',
  name: '',
  min: null,
};

@Component({
  selector: 'lib-garment-part-operation-dialog',
  standalone: true,
  imports: [ButtonModule, DrawerModule, FormsModule, InputTextModule, SelectModule],
  templateUrl: './garment-part-operation-dialog.component.html',
})
export class GarmentPartOperationDialogComponent {
  protected readonly emptyValue = '—';
  protected draftState: GarmentPartOperationDialogDraft = { ...EMPTY_GARMENT_PART_OPERATION_DRAFT };

  readonly visible = model(false);
  readonly mode = model<DialogMode>('create');
  readonly draft = input<GarmentPartOperationDialogDraft>(EMPTY_GARMENT_PART_OPERATION_DRAFT);
  readonly garmentParts = input<GarmentPartRow[]>([]);
  readonly save = output<GarmentPartOperationDialogDraft>();

  constructor() {
    effect(() => {
      this.draftState = { ...this.draft() };
    });
  }

  protected get isViewMode(): boolean {
    return this.mode() === 'view';
  }

  protected get canSave(): boolean {
    return Boolean(
      Number.isFinite(this.draftState.id) &&
      this.draftState.id > 0 &&
      this.draftState.garmentPartName.trim() &&
      this.draftState.name.trim() &&
      this.draftState.min !== null &&
      this.draftState.min !== undefined &&
      Number.isFinite(this.draftState.min),
    );
  }

  protected get header(): string {
    if (this.mode() === 'view') {
      return 'Перегляд роботи';
    }

    if (this.mode() === 'edit') {
      return 'Редагування роботи';
    }

    return 'Нова робота';
  }

  protected get title(): string {
    return this.draftState.name.trim() || 'Робота';
  }

  protected get initials(): string {
    return this.title.charAt(0).toUpperCase();
  }

  protected get selectedGarmentPartName(): string {
    return (
      this.garmentParts().find((item) => item.name === this.draftState.garmentPartName)?.name ??
      this.draftState.garmentPartName.trim() ??
      this.emptyValue
    );
  }

  protected close(): void {
    this.visible.set(false);
  }

  protected enableEditing(): void {
    this.mode.set('edit');
  }

  protected submit(): void {
    if (!this.canSave) {
      return;
    }

    this.save.emit({ ...this.draftState });
  }
}
