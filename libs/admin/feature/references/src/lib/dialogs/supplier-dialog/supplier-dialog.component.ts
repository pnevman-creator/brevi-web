import { Component, effect, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import type { SupplierDialogDraft, SupplierDialogMode } from '../reference-dialog.models';

const EMPTY_SUPPLIER_DRAFT: SupplierDialogDraft = {
  id: 0,
  name: '',
  link: '',
  contactPerson: '',
  phoneNumber: '',
  notes: '',
};

@Component({
  selector: 'lib-supplier-dialog',
  standalone: true,
  imports: [ButtonModule, DrawerModule, FormsModule, InputTextModule, TextareaModule],
  templateUrl: './supplier-dialog.component.html',
})
export class SupplierDialogComponent {
  protected readonly notesMaxLength = 500;
  protected readonly emptyValue = '—';

  protected draftState: SupplierDialogDraft = { ...EMPTY_SUPPLIER_DRAFT };

  readonly visible = model(false);
  readonly mode = model<SupplierDialogMode>('create');
  readonly draft = input<SupplierDialogDraft>(EMPTY_SUPPLIER_DRAFT);
  readonly save = output<SupplierDialogDraft>();

  constructor() {
    effect(() => {
      this.draftState = { ...this.draft() };
    });
  }

  protected get canSave(): boolean {
    return Boolean(this.draftState.name.trim());
  }

  protected get header(): string {
    if (this.mode() === 'view') {
      return 'Перегляд постачальника';
    }

    if (this.mode() === 'edit') {
      return 'Редагування постачальника';
    }

    return 'Нова позиція';
  }

  protected get isViewMode(): boolean {
    return this.mode() === 'view';
  }

  protected get supplierName(): string {
    return this.draftState.name.trim() || 'Постачальник';
  }

  protected get supplierInitials(): string {
    return this.supplierName.charAt(0).toUpperCase();
  }

  protected get supplierLink(): string {
    return this.draftState.link.trim();
  }

  protected get supplierLinkHref(): string | null {
    if (!this.supplierLink) {
      return null;
    }

    return /^https?:\/\//i.test(this.supplierLink)
      ? this.supplierLink
      : `https://${this.supplierLink}`;
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
