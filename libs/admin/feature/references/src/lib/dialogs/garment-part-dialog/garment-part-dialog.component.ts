import { Component, effect, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';

import type { GarmentPartDialogDraft } from '../reference-dialog.models';

type DialogMode = 'create' | 'edit' | 'view';

const EMPTY_GARMENT_PART_DRAFT: GarmentPartDialogDraft = {
  id: 0,
  name: '',
};

@Component({
  selector: 'lib-garment-part-dialog',
  standalone: true,
  imports: [ButtonModule, DrawerModule, FormsModule, InputTextModule],
  templateUrl: './garment-part-dialog.component.html',
})
export class GarmentPartDialogComponent {
  protected readonly emptyValue = '—';
  protected draftState: GarmentPartDialogDraft = { ...EMPTY_GARMENT_PART_DRAFT };

  readonly visible = model(false);
  readonly mode = model<DialogMode>('create');
  readonly draft = input<GarmentPartDialogDraft>(EMPTY_GARMENT_PART_DRAFT);
  readonly save = output<GarmentPartDialogDraft>();

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
      Number.isFinite(this.draftState.id) && this.draftState.id > 0 && this.draftState.name.trim(),
    );
  }

  protected get header(): string {
    if (this.mode() === 'view') {
      return 'Перегляд деталі';
    }

    if (this.mode() === 'edit') {
      return 'Редагування деталі';
    }

    return 'Нова деталь';
  }

  protected get title(): string {
    return this.draftState.name.trim() || 'Деталь';
  }

  protected get initials(): string {
    return this.title.charAt(0).toUpperCase();
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
