import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import type {
  GarmentPartOperationDialogData,
  GarmentPartOperationDialogResult,
} from '../reference-dialog.models';

@Component({
  selector: 'lib-garment-part-operation-dialog',
  imports: [ButtonModule, FormsModule, InputTextModule, SelectModule],
  templateUrl: './garment-part-operation-dialog.component.html',
})
export class GarmentPartOperationDialogComponent {
  private readonly ref = inject(DynamicDialogRef);
  protected readonly config = inject(DynamicDialogConfig) as DynamicDialogConfig & {
    data: GarmentPartOperationDialogData;
  };

  protected draft = { ...this.config.data.draft };
  protected readonly isEditMode = this.config.data.mode === 'edit';

  protected get canSave(): boolean {
    return Boolean(
      Number.isFinite(this.draft.id) &&
      this.draft.id > 0 &&
      this.draft.garmentPartName.trim() &&
      this.draft.name.trim() &&
      this.draft.min !== null &&
      this.draft.min !== undefined &&
      Number.isFinite(this.draft.min),
    );
  }

  protected cancel(): void {
    this.ref.close(null);
  }

  protected save(): void {
    if (!this.canSave) {
      return;
    }

    const result: GarmentPartOperationDialogResult = {
      originalId: this.isEditMode ? this.config.data.draft.id : null,
      draft: { ...this.draft },
    };

    this.ref.close(result);
  }
}
