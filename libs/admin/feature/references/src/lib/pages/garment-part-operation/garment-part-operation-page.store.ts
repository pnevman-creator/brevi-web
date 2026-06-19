import { DOCUMENT } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { GarmentPartOperationsApi } from '../../data-access/garment-part-operations/garment-part-operations.api';
import { GarmentPartsApi } from '../../data-access/garment-parts/garment-parts.api';

import type { GarmentPartOperationRow } from '../../data-access/garment-part-operations/garment-part-operations.models';
import type { GarmentPartRow } from '../../data-access/garment-parts/garment-parts.models';
import type {
  GarmentPartDialogDraft,
  GarmentPartOperationDialogDraft,
} from '../../dialogs/reference-dialog.models';

type DialogMode = 'create' | 'edit' | 'view';

@Injectable()
export class GarmentPartOperationPageStore {
  private readonly garmentPartsApi = inject(GarmentPartsApi);
  private readonly garmentPartOperationsApi = inject(GarmentPartOperationsApi);
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

  private _garmentPartDrawerVisible = false;
  garmentPartDrawerMode: DialogMode = 'create';
  garmentPartDrawerDraft: GarmentPartDialogDraft = this.createEmptyGarmentPartDraft();
  private garmentPartDrawerOriginalId: number | null = null;

  private _garmentPartOperationDrawerVisible = false;
  garmentPartOperationDrawerMode: DialogMode = 'create';
  garmentPartOperationDrawerDraft: GarmentPartOperationDialogDraft =
    this.createEmptyGarmentPartOperationDraft();
  private garmentPartOperationDrawerOriginalId: number | null = null;

  get garmentPartDrawerVisible(): boolean {
    return this._garmentPartDrawerVisible;
  }

  set garmentPartDrawerVisible(visible: boolean) {
    this._garmentPartDrawerVisible = visible;

    if (!visible) {
      this.garmentPartDrawerMode = 'create';
      this.garmentPartDrawerDraft = this.createEmptyGarmentPartDraft();
      this.garmentPartDrawerOriginalId = null;
    }
  }

  get garmentPartOperationDrawerVisible(): boolean {
    return this._garmentPartOperationDrawerVisible;
  }

  set garmentPartOperationDrawerVisible(visible: boolean) {
    this._garmentPartOperationDrawerVisible = visible;

    if (!visible) {
      this.garmentPartOperationDrawerMode = 'create';
      this.garmentPartOperationDrawerDraft = this.createEmptyGarmentPartOperationDraft();
      this.garmentPartOperationDrawerOriginalId = null;
    }
  }

  openGarmentPartCreateDialog(): void {
    this.openGarmentPartDrawer('create', this.createEmptyGarmentPartDraft(), null);
  }

  openGarmentPartEditDialog(garmentPart: GarmentPartRow): void {
    this.openGarmentPartDrawer('edit', this.toGarmentPartDraft(garmentPart), garmentPart.id);
  }

  openGarmentPartViewDialog(garmentPart: GarmentPartRow): void {
    this.openGarmentPartDrawer('view', this.toGarmentPartDraft(garmentPart), garmentPart.id);
  }

  openGarmentPartOperationCreateDialog(): void {
    this.openGarmentPartOperationDrawer(
      'create',
      this.createEmptyGarmentPartOperationDraft(),
      null,
    );
  }

  openGarmentPartOperationEditDialog(operation: GarmentPartOperationRow): void {
    this.openGarmentPartOperationDrawer(
      'edit',
      this.toGarmentPartOperationDraft(operation),
      operation.id,
    );
  }

  openGarmentPartOperationViewDialog(operation: GarmentPartOperationRow): void {
    this.openGarmentPartOperationDrawer(
      'view',
      this.toGarmentPartOperationDraft(operation),
      operation.id,
    );
  }

  closeGarmentPartDrawer(): void {
    this.garmentPartDrawerVisible = false;
  }

  closeGarmentPartOperationDrawer(): void {
    this.garmentPartOperationDrawerVisible = false;
  }

  async saveGarmentPartDraft(draft: GarmentPartDialogDraft): Promise<void> {
    if (this.garmentPartDrawerMode === 'view') {
      return;
    }

    if (this.garmentPartDrawerMode === 'create') {
      const created = await this.createGarmentPart(draft);

      if (created) {
        this.closeGarmentPartDrawer();
      }

      return;
    }

    const updated = await this.updateGarmentPart(
      this.garmentPartDrawerOriginalId ?? draft.id,
      draft,
    );

    if (updated) {
      this.closeGarmentPartDrawer();
    }
  }

  async saveGarmentPartOperationDraft(draft: GarmentPartOperationDialogDraft): Promise<void> {
    if (this.garmentPartOperationDrawerMode === 'view') {
      return;
    }

    if (this.garmentPartOperationDrawerMode === 'create') {
      const created = await this.createGarmentPartOperation(draft);

      if (created) {
        this.closeGarmentPartOperationDrawer();
      }

      return;
    }

    const updated = await this.updateGarmentPartOperation(
      this.garmentPartOperationDrawerOriginalId ?? draft.id,
      draft,
    );

    if (updated) {
      this.closeGarmentPartOperationDrawer();
    }
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

  private async createGarmentPart(draft: GarmentPartDialogDraft): Promise<boolean> {
    if (!Number.isFinite(draft.id) || draft.id <= 0 || !draft.name.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть усі поля деталі перед збереженням.',
      });
      return false;
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
      return true;
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Деталь не створено.',
      });
      return false;
    }
  }

  private async updateGarmentPart(id: number, draft: GarmentPartDialogDraft): Promise<boolean> {
    if (!Number.isFinite(id) || id <= 0 || !draft.name.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть усі поля деталі перед збереженням.',
      });
      return false;
    }

    try {
      await firstValueFrom(this.garmentPartsApi.update(id, { name: draft.name }));

      this.reloadGarmentPartsPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Деталь №${id} оновлено.`,
      });
      return true;
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: `Деталь №${id} не збережено.`,
      });
      return false;
    }
  }

  private async createGarmentPartOperation(
    draft: GarmentPartOperationDialogDraft,
  ): Promise<boolean> {
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
      return false;
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
      return true;
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Роботу не створено.',
      });
      return false;
    }
  }

  private async updateGarmentPartOperation(
    id: number,
    draft: GarmentPartOperationDialogDraft,
  ): Promise<boolean> {
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
      return false;
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
      return true;
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: `Роботу №${id} не збережено.`,
      });
      return false;
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

  private createEmptyGarmentPartDraft(): GarmentPartDialogDraft {
    return {
      id: this.getNextId(this.garmentParts.value()),
      name: '',
    };
  }

  private createEmptyGarmentPartOperationDraft(): GarmentPartOperationDialogDraft {
    const garmentParts = this.garmentParts.value();

    return {
      id: this.getNextId(this.garmentPartOperations.value()),
      garmentPartName: garmentParts[0]?.name ?? '',
      name: '',
      min: null,
    };
  }

  private toGarmentPartDraft(garmentPart: GarmentPartRow): GarmentPartDialogDraft {
    return {
      id: garmentPart.id,
      name: garmentPart.name,
    };
  }

  private toGarmentPartOperationDraft(
    operation: GarmentPartOperationRow,
  ): GarmentPartOperationDialogDraft {
    return {
      id: operation.id,
      garmentPartName: operation.garmentPartName,
      name: operation.name,
      min: operation.min,
    };
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

  private openGarmentPartDrawer(
    mode: DialogMode,
    draft: GarmentPartDialogDraft,
    originalId: number | null,
  ): void {
    this.garmentPartDrawerMode = mode;
    this.garmentPartDrawerDraft = draft;
    this.garmentPartDrawerOriginalId = originalId;
    this.garmentPartDrawerVisible = true;
  }

  private openGarmentPartOperationDrawer(
    mode: DialogMode,
    draft: GarmentPartOperationDialogDraft,
    originalId: number | null,
  ): void {
    this.garmentPartOperationDrawerMode = mode;
    this.garmentPartOperationDrawerDraft = draft;
    this.garmentPartOperationDrawerOriginalId = originalId;
    this.garmentPartOperationDrawerVisible = true;
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
