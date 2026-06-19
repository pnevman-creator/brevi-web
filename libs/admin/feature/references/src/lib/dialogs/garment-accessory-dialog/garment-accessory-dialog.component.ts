import { Component, effect, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import type { SupplierRow } from '../../data-access/suppliers/suppliers.models';
import type { GarmentAccessoryDialogDraft } from '../reference-dialog.models';

type DialogMode = 'create' | 'edit' | 'view';

const EMPTY_GARMENT_ACCESSORY_DRAFT: GarmentAccessoryDialogDraft = {
  id: 0,
  name: '',
  price: null,
  supplierId: 0,
};

@Component({
  selector: 'lib-garment-accessory-dialog',
  standalone: true,
  imports: [ButtonModule, DrawerModule, FormsModule, InputTextModule, SelectModule],
  templateUrl: './garment-accessory-dialog.component.html',
})
export class GarmentAccessoryDialogComponent {
  protected readonly emptyValue = '—';

  protected draftState: GarmentAccessoryDialogDraft = { ...EMPTY_GARMENT_ACCESSORY_DRAFT };

  readonly visible = model(false);
  readonly mode = model<DialogMode>('create');
  readonly draft = input<GarmentAccessoryDialogDraft>(EMPTY_GARMENT_ACCESSORY_DRAFT);
  readonly suppliers = input<SupplierRow[]>([]);
  readonly save = output<GarmentAccessoryDialogDraft>();

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
      this.draftState.name.trim() &&
      this.draftState.price !== null &&
      Number.isFinite(this.draftState.id) &&
      this.draftState.id > 0 &&
      Number.isFinite(this.draftState.supplierId) &&
      this.draftState.supplierId > 0,
    );
  }

  protected get header(): string {
    if (this.mode() === 'view') {
      return 'Перегляд фурнітури';
    }

    if (this.mode() === 'edit') {
      return 'Редагування фурнітури';
    }

    return 'Нова фурнітура';
  }

  protected get accessoryTitle(): string {
    return this.draftState.name.trim() || 'Фурнітура';
  }

  protected get accessoryInitials(): string {
    return this.accessoryTitle.charAt(0).toUpperCase();
  }

  protected get formattedPrice(): string {
    const value = this.draftState.price ?? 0;

    return `${new Intl.NumberFormat('uk-UA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)} грн`;
  }

  protected get selectedSupplierName(): string {
    return (
      this.suppliers().find((supplier) => supplier.id === this.draftState.supplierId)?.name ??
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
