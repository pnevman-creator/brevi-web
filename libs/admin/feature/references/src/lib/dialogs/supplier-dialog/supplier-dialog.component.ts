import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import type { SupplierDialogData, SupplierDialogResult } from '../reference-dialog.models';

@Component({
  selector: 'lib-supplier-dialog',
  imports: [ButtonModule, FormsModule, InputTextModule, TextareaModule],
  templateUrl: './supplier-dialog.component.html',
})
export class SupplierDialogComponent {
  protected readonly notesMaxLength = 500;
  private readonly ref = inject(DynamicDialogRef);
  protected readonly config = inject(DynamicDialogConfig) as DynamicDialogConfig & {
    data: SupplierDialogData;
  };

  protected draft = { ...this.config.data.draft };
  protected readonly isEditMode = this.config.data.mode === 'edit';

  protected get canSave(): boolean {
    return Boolean(this.draft.name.trim());
  }

  protected cancel(): void {
    this.ref.close(null);
  }

  protected save(): void {
    if (!this.canSave) {
      return;
    }

    const result: SupplierDialogResult = {
      originalId: this.isEditMode ? this.config.data.draft.id : null,
      draft: { ...this.draft },
    };

    this.ref.close(result);
  }
}
