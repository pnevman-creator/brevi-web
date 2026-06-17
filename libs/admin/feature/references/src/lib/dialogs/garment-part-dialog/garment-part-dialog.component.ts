import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import type { GarmentPartDialogData, GarmentPartDialogResult } from '../reference-dialog.models';

@Component({
  selector: 'lib-garment-part-dialog',
  imports: [ButtonModule, FormsModule, InputTextModule, SelectModule],
  templateUrl: './garment-part-dialog.component.html',
})
export class GarmentPartDialogComponent {
  private readonly ref = inject(DynamicDialogRef);
  protected readonly config = inject(DynamicDialogConfig) as DynamicDialogConfig & {
    data: GarmentPartDialogData;
  };

  protected draft = { ...this.config.data.draft };
  protected readonly isEditMode = this.config.data.mode === 'edit';

  protected get canSave(): boolean {
    return Boolean(
      Number.isFinite(this.draft.id) &&
      this.draft.id > 0 &&
      this.draft.name.trim() &&
      Number.isFinite(this.draft.supplierId) &&
      this.draft.supplierId > 0,
    );
  }

  protected cancel(): void {
    this.ref.close(null);
  }

  protected save(): void {
    if (!this.canSave) {
      return;
    }

    const result: GarmentPartDialogResult = {
      originalId: this.isEditMode ? this.config.data.draft.id : null,
      draft: { ...this.draft },
    };

    this.ref.close(result);
  }
}
