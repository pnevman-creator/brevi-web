import { Component, effect, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import type { SupplierRow } from '../../data-access/suppliers/suppliers.models';
import type { FabricDialogDraft } from '../reference-dialog.models';

type DialogMode = 'create' | 'edit' | 'view';

const EMPTY_FABRIC_DRAFT: FabricDialogDraft = {
  id: 0,
  name: '',
  price: null,
  providerName: '',
};

@Component({
  selector: 'lib-fabric-dialog',
  standalone: true,
  imports: [ButtonModule, DrawerModule, FormsModule, InputTextModule, SelectModule],
  templateUrl: './fabric-dialog.component.html',
})
export class FabricDialogComponent {
  protected readonly emptyValue = '—';

  protected draftState: FabricDialogDraft = { ...EMPTY_FABRIC_DRAFT };

  readonly visible = model(false);
  readonly mode = model<DialogMode>('create');
  readonly draft = input<FabricDialogDraft>(EMPTY_FABRIC_DRAFT);
  readonly suppliers = input<SupplierRow[]>([]);
  readonly save = output<FabricDialogDraft>();

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
      this.draftState.providerName.trim() &&
      this.draftState.price !== null &&
      Number.isFinite(this.draftState.id) &&
      this.draftState.id > 0,
    );
  }

  protected get header(): string {
    if (this.mode() === 'view') {
      return 'Перегляд тканини';
    }

    if (this.mode() === 'edit') {
      return 'Редагування тканини';
    }

    return 'Нова тканина';
  }

  protected get fabricTitle(): string {
    return this.draftState.name.trim() || 'Тканина';
  }

  protected get fabricInitials(): string {
    return this.fabricTitle.charAt(0).toUpperCase();
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
      this.suppliers().find((supplier) => supplier.name === this.draftState.providerName)?.name ||
      this.draftState.providerName.trim() ||
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
