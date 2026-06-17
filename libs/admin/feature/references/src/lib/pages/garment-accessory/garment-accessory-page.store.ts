import { DOCUMENT } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';

import { FabricsApi } from '../../data-access/fabrics/fabrics.api';
import { GarmentAccessoriesApi } from '../../data-access/garment-accessories/garment-accessories.api';
import { FabricDialogComponent } from '../../dialogs/fabric-dialog/fabric-dialog.component';
import { GarmentAccessoryDialogComponent } from '../../dialogs/garment-accessory-dialog/garment-accessory-dialog.component';

import type { FabricRow } from '../../data-access/fabrics/fabrics.models';
import type { GarmentAccessoryRow } from '../../data-access/garment-accessories/garment-accessories.models';
import type { SupplierRow } from '../../data-access/suppliers/suppliers.models';
import type {
  FabricDialogData,
  FabricDialogDraft,
  FabricDialogResult,
  GarmentAccessoryDialogData,
  GarmentAccessoryDialogDraft,
  GarmentAccessoryDialogResult,
} from '../../dialogs/reference-dialog.models';

@Injectable()
export class GarmentAccessoryPageStore {
  private readonly fabricsApi = inject(FabricsApi);
  private readonly garmentAccessoriesApi = inject(GarmentAccessoriesApi);
  private readonly dialogService = inject(DialogService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly document = inject(DOCUMENT);

  selectedFabrics: FabricRow[] = [];
  selectedGarmentAccessories: GarmentAccessoryRow[] = [];

  readonly fabrics = httpResource<FabricRow[]>(() => '/api/reference/fabrics', {
    defaultValue: [],
  });

  readonly garmentAccessories = httpResource<GarmentAccessoryRow[]>(
    () => '/api/reference/garment-accessories',
    {
      defaultValue: [],
    },
  );

  readonly suppliers = httpResource<SupplierRow[]>(() => '/api/reference/suppliers', {
    defaultValue: [],
  });

  async openFabricCreateDialog(): Promise<void> {
    const draft = await this.openFabricDialog({
      mode: 'create',
      draft: {
        id: this.getNextFabricId(),
        name: '',
        price: null,
        providerName: '',
      },
      suppliers: this.suppliers.value(),
    });

    if (!draft) {
      return;
    }

    await this.createFabric(draft.draft);
  }

  async openFabricEditDialog(fabric: FabricRow): Promise<void> {
    const draft = await this.openFabricDialog({
      mode: 'edit',
      draft: {
        id: fabric.id,
        name: fabric.name,
        price: fabric.price,
        providerName: fabric.providerName,
      },
      suppliers: this.suppliers.value(),
    });

    if (!draft) {
      return;
    }

    await this.updateFabric(draft.originalId ?? fabric.id, draft.draft);
  }

  async openGarmentAccessoryCreateDialog(): Promise<void> {
    const draft = await this.openGarmentAccessoryDialog({
      mode: 'create',
      draft: {
        id: this.getNextGarmentAccessoryId(),
        name: '',
        price: null,
      },
    });

    if (!draft) {
      return;
    }

    await this.createGarmentAccessory(draft.draft);
  }

  async openGarmentAccessoryEditDialog(accessory: GarmentAccessoryRow): Promise<void> {
    const draft = await this.openGarmentAccessoryDialog({
      mode: 'edit',
      draft: {
        id: accessory.id,
        name: accessory.name,
        price: accessory.price,
      },
    });

    if (!draft) {
      return;
    }

    await this.updateGarmentAccessory(draft.originalId ?? accessory.id, draft.draft);
  }

  private openFabricDialog(data: FabricDialogData): Promise<FabricDialogResult | null> {
    const ref = this.dialogService.open(FabricDialogComponent, {
      data,
      header: data.mode === 'create' ? 'Нова тканина' : 'Редагування тканини',
      modal: true,
      draggable: false,
      resizable: false,
      width: '36rem',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
    })!;

    return firstValueFrom(ref.onClose);
  }

  private openGarmentAccessoryDialog(
    data: GarmentAccessoryDialogData,
  ): Promise<GarmentAccessoryDialogResult | null> {
    const ref = this.dialogService.open(GarmentAccessoryDialogComponent, {
      data,
      header: data.mode === 'create' ? 'Нова фурнітура' : 'Редагування фурнітури',
      modal: true,
      draggable: false,
      resizable: false,
      width: '32rem',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
    })!;

    return firstValueFrom(ref.onClose);
  }

  confirmDeleteFabrics(fabrics: FabricRow[]): void {
    if (!fabrics.length) {
      return;
    }

    const selectedIds = fabrics.map((fabric) => fabric.id);
    this.confirmationService.confirm({
      header: 'Підтвердження видалення',
      message: `Ви впевнені, що хочете видалити ${this.formatDeletionCount(selectedIds.length)}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Видалити',
      rejectLabel: 'Скасувати',
      accept: () => {
        void this.deleteFabricsByIds(selectedIds);
      },
    });
  }

  confirmDeleteGarmentAccessories(accessories: GarmentAccessoryRow[]): void {
    if (!accessories.length) {
      return;
    }

    const selectedIds = accessories.map((accessory) => accessory.id);
    this.confirmationService.confirm({
      header: 'Підтвердження видалення',
      message: `Ви впевнені, що хочете видалити ${this.formatDeletionCount(selectedIds.length)}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Видалити',
      rejectLabel: 'Скасувати',
      accept: () => {
        void this.deleteGarmentAccessoriesByIds(selectedIds);
      },
    });
  }

  private async createFabric(draft: FabricDialogDraft): Promise<void> {
    if (
      !Number.isFinite(draft.id) ||
      draft.id <= 0 ||
      !draft.name.trim() ||
      draft.price === null ||
      !draft.providerName.trim()
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть усі поля тканини перед збереженням.',
      });
      return;
    }

    try {
      await firstValueFrom(
        this.fabricsApi.create({
          id: Number(draft.id),
          name: draft.name,
          price: draft.price,
          providerName: draft.providerName,
        }),
      );

      this.reloadFabricsPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Тканину №${draft.id} створено.`,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Тканину не створено.',
      });
    }
  }

  private async updateFabric(id: number, draft: FabricDialogDraft): Promise<void> {
    if (
      !Number.isFinite(id) ||
      id <= 0 ||
      !draft.name.trim() ||
      draft.price === null ||
      !draft.providerName.trim()
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть усі поля тканини перед збереженням.',
      });
      return;
    }

    try {
      await firstValueFrom(
        this.fabricsApi.update(id, {
          name: draft.name,
          price: draft.price,
          providerName: draft.providerName,
        }),
      );

      this.reloadFabricsPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Тканину №${id} оновлено.`,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: `Тканину №${id} не збережено.`,
      });
    }
  }

  private async createGarmentAccessory(draft: GarmentAccessoryDialogDraft): Promise<void> {
    if (!Number.isFinite(draft.id) || draft.id <= 0 || !draft.name.trim() || draft.price === null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть усі поля фурнітури перед збереженням.',
      });
      return;
    }

    try {
      await firstValueFrom(
        this.garmentAccessoriesApi.create({
          id: Number(draft.id),
          name: draft.name,
          price: draft.price,
        }),
      );

      this.reloadGarmentAccessoriesPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Фурнітуру №${draft.id} створено.`,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Фурнітуру не створено.',
      });
    }
  }

  private async updateGarmentAccessory(
    id: number,
    draft: GarmentAccessoryDialogDraft,
  ): Promise<void> {
    if (!Number.isFinite(id) || id <= 0 || !draft.name.trim() || draft.price === null) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть усі поля фурнітури перед збереженням.',
      });
      return;
    }

    try {
      await firstValueFrom(
        this.garmentAccessoriesApi.update(id, {
          name: draft.name,
          price: draft.price,
        }),
      );

      this.reloadGarmentAccessoriesPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Фурнітуру №${id} оновлено.`,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: `Фурнітуру №${id} не збережено.`,
      });
    }
  }

  private async deleteFabricsByIds(selectedIds: number[]): Promise<void> {
    const results = await Promise.allSettled(
      selectedIds.map((id) => firstValueFrom(this.fabricsApi.delete(id))),
    );

    this.selectedFabrics = [];
    this.reloadFabricsPreservingScroll();

    const failedCount = results.filter((result) => result.status === 'rejected').length;
    this.messageService.add({
      severity: failedCount === 0 ? 'success' : 'error',
      summary: failedCount === 0 ? 'Видалено' : 'Помилка видалення',
      detail:
        failedCount === 0
          ? 'Вибрані тканини видалено.'
          : `Видалено ${selectedIds.length - failedCount} з ${selectedIds.length} тканин.`,
    });
  }

  private async deleteGarmentAccessoriesByIds(selectedIds: number[]): Promise<void> {
    const results = await Promise.allSettled(
      selectedIds.map((id) => firstValueFrom(this.garmentAccessoriesApi.delete(id))),
    );

    this.selectedGarmentAccessories = [];
    this.reloadGarmentAccessoriesPreservingScroll();

    const failedCount = results.filter((result) => result.status === 'rejected').length;
    this.messageService.add({
      severity: failedCount === 0 ? 'success' : 'error',
      summary: failedCount === 0 ? 'Видалено' : 'Помилка видалення',
      detail:
        failedCount === 0
          ? 'Вибрану фурнітуру видалено.'
          : `Видалено ${selectedIds.length - failedCount} з ${selectedIds.length} позицій фурнітури.`,
    });
  }

  private getNextFabricId(): number {
    return this.getNextId(this.fabrics.value());
  }

  private getNextGarmentAccessoryId(): number {
    return this.getNextId(this.garmentAccessories.value());
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

  private reloadFabricsPreservingScroll(): void {
    const scrollPosition = this.getMainScrollPosition();
    this.fabrics.reload();
    this.restoreMainScrollPosition(scrollPosition);
  }

  private reloadGarmentAccessoriesPreservingScroll(): void {
    const scrollPosition = this.getMainScrollPosition();
    this.garmentAccessories.reload();
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
