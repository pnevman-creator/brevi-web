import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import type { FabricDialogData, FabricDialogResult } from '../reference-dialog.models';

@Component({
  selector: 'lib-fabric-dialog',
  imports: [ButtonModule, FormsModule, InputTextModule, SelectModule],
  templateUrl: './fabric-dialog.component.html',
})
export class FabricDialogComponent {
  private readonly ref = inject(DynamicDialogRef);
  protected readonly config = inject(DynamicDialogConfig) as DynamicDialogConfig & {
    data: FabricDialogData;
  };

  protected draft = { ...this.config.data.draft };
  protected readonly isEditMode = this.config.data.mode === 'edit';

  protected get canSave(): boolean {
    return Boolean(
      this.draft.name.trim() &&
      this.draft.providerName.trim() &&
      this.draft.price !== null &&
      Number.isFinite(this.draft.id) &&
      this.draft.id > 0,
    );
  }

  protected cancel(): void {
    this.ref.close(null);
  }

  protected save(): void {
    if (!this.canSave) {
      return;
    }

    const result: FabricDialogResult = {
      originalId: this.isEditMode ? this.config.data.draft.id : null,
      draft: { ...this.draft },
    };

    this.ref.close(result);
  }
}
