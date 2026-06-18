import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';

import type {
  AdditionalReferenceDialogData,
  AdditionalReferenceDialogResult,
} from './additional-reference-dialog.models';

@Component({
  selector: 'lib-additional-reference-dialog',
  imports: [ButtonModule, FormsModule, InputTextModule],
  templateUrl: './additional-reference-dialog.component.html',
})
export class AdditionalReferenceDialogComponent {
  private readonly ref = inject(DynamicDialogRef);
  protected readonly config = inject(DynamicDialogConfig) as DynamicDialogConfig & {
    data: AdditionalReferenceDialogData;
  };

  protected draft = { ...this.config.data.draft };
  protected readonly isEditMode = this.config.data.mode === 'edit';

  protected get canSave(): boolean {
    return Boolean(
      Number.isFinite(this.draft.id) &&
      this.draft.id > 0 &&
      this.draft.name.trim() &&
      this.draft.key.trim() &&
      this.draft.value !== null &&
      Number.isFinite(this.draft.value) &&
      this.draft.unit.trim(),
    );
  }

  protected cancel(): void {
    this.ref.close(null);
  }

  protected save(): void {
    if (!this.canSave) {
      return;
    }

    const result: AdditionalReferenceDialogResult = {
      originalId: this.isEditMode ? this.config.data.draft.id : null,
      draft: { ...this.draft, value: Number(this.draft.value) },
    };

    this.ref.close(result);
  }
}
