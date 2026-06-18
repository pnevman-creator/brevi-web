import { DOCUMENT } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';

import { GarmentPartOperationsApi } from '../../data-access/garment-part-operations/garment-part-operations.api';
import { GarmentPartsApi } from '../../data-access/garment-parts/garment-parts.api';
import { GarmentPartDialogComponent } from '../../dialogs/garment-part-dialog/garment-part-dialog.component';
import { GarmentPartOperationDialogComponent } from '../../dialogs/garment-part-operation-dialog/garment-part-operation-dialog.component';

import type { GarmentPartOperationRow } from '../../data-access/garment-part-operations/garment-part-operations.models';
import type { GarmentPartRow } from '../../data-access/garment-parts/garment-parts.models';
import type {
  GarmentPartDialogData,
  GarmentPartDialogDraft,
  GarmentPartDialogResult,
  GarmentPartOperationDialogData,
  GarmentPartOperationDialogDraft,
  GarmentPartOperationDialogResult,
} from '../../dialogs/reference-dialog.models';

@Injectable()
export class GarmentPartOperationPageStore {
  private readonly garmentPartsApi = inject(GarmentPartsApi);
  private readonly garmentPartOperationsApi = inject(GarmentPartOperationsApi);
  private readonly dialogService = inject(DialogService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly document = inject(DOCUMENT);

  selectedGarmentParts: GarmentPartRow[] = [];
  selectedGarmentPartOperations: GarmentPartOperationRow[] = [];

  readonly garmentParts = httpResource<GarmentPartRow[]>(() => '/api/reference/garment-parts', {
    defaultValue: [],
  });

  readonly garmentPartOperations = httpResource<GarmentPartOperationRow[]>(
    () => '/api/reference/garment-part-operations',
    {
      defaultValue: [],
    },
  );

  async openGarmentPartCreateDialog(): Promise<void> {
    const draft = await this.openGarmentPartDialog({
      mode: 'create',
      draft: {
        id: this.getNextId(this.garmentParts.value()),
        name: '',
      },
    });

    if (!draft) {
      return;
    }

    await this.createGarmentPart(draft.draft);
  }

  async openGarmentPartEditDialog(garmentPart: GarmentPartRow): Promise<void> {
    const draft = await this.openGarmentPartDialog({
      mode: 'edit',
      draft: {
        id: garmentPart.id,
        name: garmentPart.name,
      },
    });

    if (!draft) {
      return;
    }

    await this.updateGarmentPart(draft.originalId ?? garmentPart.id, draft.draft);
  }

  async openGarmentPartOperationCreateDialog(): Promise<void> {
    const garmentParts = this.garmentParts.value();
    const draft = await this.openGarmentPartOperationDialog({
      mode: 'create',
      draft: {
        id: this.getNextId(this.garmentPartOperations.value()),
        garmentPartName: garmentParts[0]?.name ?? '',
        name: '',
        min: null,
      },
      garmentParts,
    });

    if (!draft) {
      return;
    }

    await this.createGarmentPartOperation(draft.draft);
  }

  async openGarmentPartOperationEditDialog(operation: GarmentPartOperationRow): Promise<void> {
    const draft = await this.openGarmentPartOperationDialog({
      mode: 'edit',
      draft: {
        id: operation.id,
        garmentPartName: operation.garmentPartName,
        name: operation.name,
        min: operation.min,
      },
      garmentParts: this.garmentParts.value(),
    });

    if (!draft) {
      return;
    }

    await this.updateGarmentPartOperation(draft.originalId ?? operation.id, draft.draft);
  }

  confirmDeleteGarmentParts(garmentParts: GarmentPartRow[]): void {
    if (!garmentParts.length) {
      return;
    }

    const selectedIds = garmentParts.map((garmentPart) => garmentPart.id);
    this.confirmationService.confirm({
      header: 'Підтвердження видалення',
      message: `Ви впевнені, що хочете видалити ${this.formatDeletionCount(selectedIds.length)}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Видалити',
      rejectLabel: 'Скасувати',
      accept: () => {
        void this.deleteGarmentPartsByIds(selectedIds);
      },
    });
  }

  confirmDeleteGarmentPartOperations(operations: GarmentPartOperationRow[]): void {
    if (!operations.length) {
      return;
    }

    const selectedIds = operations.map((operation) => operation.id);
    this.confirmationService.confirm({
      header: 'Підтвердження видалення',
      message: `Ви впевнені, що хочете видалити ${this.formatDeletionCount(selectedIds.length)}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Видалити',
      rejectLabel: 'Скасувати',
      accept: () => {
        void this.deleteGarmentPartOperationsByIds(selectedIds);
      },
    });
  }

  private openGarmentPartDialog(
    data: GarmentPartDialogData,
  ): Promise<GarmentPartDialogResult | null> {
    const ref = this.dialogService.open(GarmentPartDialogComponent, {
      data,
      header: data.mode === 'create' ? 'Нова деталь' : 'Редагування деталі',
      modal: true,
      draggable: false,
      resizable: false,
      width: '28rem',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
    })!;

    return firstValueFrom(ref.onClose);
  }

  private openGarmentPartOperationDialog(
    data: GarmentPartOperationDialogData,
  ): Promise<GarmentPartOperationDialogResult | null> {
    const ref = this.dialogService.open(GarmentPartOperationDialogComponent, {
      data,
      header: data.mode === 'create' ? 'Нова робота' : 'Редагування роботи',
      modal: true,
      draggable: false,
      resizable: false,
      width: '34rem',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
    })!;

    return firstValueFrom(ref.onClose);
  }

  private async createGarmentPart(draft: GarmentPartDialogDraft): Promise<void> {
    if (!Number.isFinite(draft.id) || draft.id <= 0 || !draft.name.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть усі поля деталі перед збереженням.',
      });
      return;
    }

    try {
      await firstValueFrom(
        this.garmentPartsApi.create({
          id: Number(draft.id),
          name: draft.name,
        }),
      );

      this.reloadGarmentPartsPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Деталь №${draft.id} створено.`,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Деталь не створено.',
      });
    }
  }

  private async updateGarmentPart(id: number, draft: GarmentPartDialogDraft): Promise<void> {
    if (!Number.isFinite(id) || id <= 0 || !draft.name.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть усі поля деталі перед збереженням.',
      });
      return;
    }

    try {
      await firstValueFrom(this.garmentPartsApi.update(id, { name: draft.name }));

      this.reloadGarmentPartsPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Деталь №${id} оновлено.`,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: `Деталь №${id} не збережено.`,
      });
    }
  }

  private async createGarmentPartOperation(draft: GarmentPartOperationDialogDraft): Promise<void> {
    if (
      !Number.isFinite(draft.id) ||
      draft.id <= 0 ||
      !draft.garmentPartName.trim() ||
      !draft.name.trim() ||
      draft.min === null ||
      !Number.isFinite(draft.min)
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть усі поля роботи перед збереженням.',
      });
      return;
    }

    try {
      await firstValueFrom(
        this.garmentPartOperationsApi.create({
          id: Number(draft.id),
          garmentPartName: draft.garmentPartName,
          name: draft.name,
          min: draft.min,
        }),
      );

      this.reloadGarmentPartOperationsPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Роботу №${draft.id} створено.`,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Роботу не створено.',
      });
    }
  }

  private async updateGarmentPartOperation(
    id: number,
    draft: GarmentPartOperationDialogDraft,
  ): Promise<void> {
    if (
      !Number.isFinite(id) ||
      id <= 0 ||
      !draft.garmentPartName.trim() ||
      !draft.name.trim() ||
      draft.min === null ||
      !Number.isFinite(draft.min)
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть усі поля роботи перед збереженням.',
      });
      return;
    }

    try {
      await firstValueFrom(
        this.garmentPartOperationsApi.update(id, {
          garmentPartName: draft.garmentPartName,
          name: draft.name,
          min: draft.min,
        }),
      );

      this.reloadGarmentPartOperationsPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Роботу №${id} оновлено.`,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: `Роботу №${id} не збережено.`,
      });
    }
  }

  private async deleteGarmentPartsByIds(selectedIds: number[]): Promise<void> {
    const results = await Promise.allSettled(
      selectedIds.map((id) => firstValueFrom(this.garmentPartsApi.delete(id))),
    );

    this.selectedGarmentParts = [];
    this.reloadGarmentPartsPreservingScroll();

    const failedCount = results.filter((result) => result.status === 'rejected').length;
    this.messageService.add({
      severity: failedCount === 0 ? 'success' : 'error',
      summary: failedCount === 0 ? 'Видалено' : 'Помилка видалення',
      detail:
        failedCount === 0
          ? 'Вибрані деталі видалено.'
          : `Видалено ${selectedIds.length - failedCount} з ${selectedIds.length} деталей.`,
    });
  }

  private async deleteGarmentPartOperationsByIds(selectedIds: number[]): Promise<void> {
    const results = await Promise.allSettled(
      selectedIds.map((id) => firstValueFrom(this.garmentPartOperationsApi.delete(id))),
    );

    this.selectedGarmentPartOperations = [];
    this.reloadGarmentPartOperationsPreservingScroll();

    const failedCount = results.filter((result) => result.status === 'rejected').length;
    this.messageService.add({
      severity: failedCount === 0 ? 'success' : 'error',
      summary: failedCount === 0 ? 'Видалено' : 'Помилка видалення',
      detail:
        failedCount === 0
          ? 'Вибрані роботи видалено.'
          : `Видалено ${selectedIds.length - failedCount} з ${selectedIds.length} робіт.`,
    });
  }

  private getNextId(items: Array<{ id: number }>): number {
    const maxId = items.reduce((currentMax, item) => Math.max(currentMax, item.id), 0);

    return maxId + 1;
  }

  private formatDeletionCount(count: number): string {
    return `${count} ${this.getPositionNoun(count)}`;
  }

  private getPositionNoun(count: number): string {
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return 'позицій';
    }

    const lastDigit = count % 10;

    if (lastDigit === 1) {
      return 'позицію';
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'позиції';
    }

    return 'позицій';
  }

  private reloadGarmentPartsPreservingScroll(): void {
    const scrollPosition = this.getMainScrollPosition();
    this.garmentParts.reload();
    this.restoreMainScrollPosition(scrollPosition);
  }

  private reloadGarmentPartOperationsPreservingScroll(): void {
    const scrollPosition = this.getMainScrollPosition();
    this.garmentPartOperations.reload();
    this.restoreMainScrollPosition(scrollPosition);
  }

  private getMainScrollPosition(): { top: number; left: number } {
    const mainElement = this.document.querySelector('main');

    if (!(mainElement instanceof HTMLElement)) {
      return { top: 0, left: 0 };
    }

    return {
      top: mainElement.scrollTop,
      left: mainElement.scrollLeft,
    };
  }

  private restoreMainScrollPosition(position: { top: number; left: number }): void {
    setTimeout(() => {
      const mainElement = this.document.querySelector('main');

      if (!(mainElement instanceof HTMLElement)) {
        return;
      }

      mainElement.scrollTo({
        top: position.top,
        left: position.left,
        behavior: 'auto',
      });
    }, 0);
  }
}
