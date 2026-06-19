import { DOCUMENT } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { FabricsApi } from '../../data-access/fabrics/fabrics.api';
import { GarmentAccessoriesApi } from '../../data-access/garment-accessories/garment-accessories.api';

import type { FabricRow } from '../../data-access/fabrics/fabrics.models';
import type { GarmentAccessoryRow } from '../../data-access/garment-accessories/garment-accessories.models';
import type { SupplierRow } from '../../data-access/suppliers/suppliers.models';
import type {
  FabricDialogDraft,
  GarmentAccessoryDialogDraft,
} from '../../dialogs/reference-dialog.models';

type DialogMode = 'create' | 'edit' | 'view';

@Injectable()
export class GarmentAccessoryPageStore {
  private readonly fabricsApi = inject(FabricsApi);
  private readonly garmentAccessoriesApi = inject(GarmentAccessoriesApi);
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

  private _fabricDrawerVisible = false;
  fabricDrawerMode: DialogMode = 'create';
  fabricDrawerDraft: FabricDialogDraft = this.createEmptyFabricDraft();
  private fabricDrawerOriginalId: number | null = null;

  private _garmentAccessoryDrawerVisible = false;
  garmentAccessoryDrawerMode: DialogMode = 'create';
  garmentAccessoryDrawerDraft: GarmentAccessoryDialogDraft =
    this.createEmptyGarmentAccessoryDraft();
  private garmentAccessoryDrawerOriginalId: number | null = null;

  get fabricDrawerVisible(): boolean {
    return this._fabricDrawerVisible;
  }

  set fabricDrawerVisible(visible: boolean) {
    this._fabricDrawerVisible = visible;

    if (!visible) {
      this.fabricDrawerMode = 'create';
      this.fabricDrawerDraft = this.createEmptyFabricDraft();
      this.fabricDrawerOriginalId = null;
    }
  }

  get garmentAccessoryDrawerVisible(): boolean {
    return this._garmentAccessoryDrawerVisible;
  }

  set garmentAccessoryDrawerVisible(visible: boolean) {
    this._garmentAccessoryDrawerVisible = visible;

    if (!visible) {
      this.garmentAccessoryDrawerMode = 'create';
      this.garmentAccessoryDrawerDraft = this.createEmptyGarmentAccessoryDraft();
      this.garmentAccessoryDrawerOriginalId = null;
    }
  }

  openFabricCreateDialog(): void {
    this.openFabricDrawer('create', this.createEmptyFabricDraft(), null);
  }

  openFabricEditDialog(fabric: FabricRow): void {
    this.openFabricDrawer('edit', this.toFabricDraft(fabric), fabric.id);
  }

  openFabricViewDialog(fabric: FabricRow): void {
    this.openFabricDrawer('view', this.toFabricDraft(fabric), fabric.id);
  }

  openGarmentAccessoryCreateDialog(): void {
    this.openGarmentAccessoryDrawer('create', this.createEmptyGarmentAccessoryDraft(), null);
  }

  openGarmentAccessoryEditDialog(accessory: GarmentAccessoryRow): void {
    this.openGarmentAccessoryDrawer('edit', this.toGarmentAccessoryDraft(accessory), accessory.id);
  }

  openGarmentAccessoryViewDialog(accessory: GarmentAccessoryRow): void {
    this.openGarmentAccessoryDrawer('view', this.toGarmentAccessoryDraft(accessory), accessory.id);
  }

  closeFabricDrawer(): void {
    this.fabricDrawerVisible = false;
  }

  closeGarmentAccessoryDrawer(): void {
    this.garmentAccessoryDrawerVisible = false;
  }

  async saveFabricDraft(draft: FabricDialogDraft): Promise<void> {
    if (this.fabricDrawerMode === 'view') {
      return;
    }

    if (this.fabricDrawerMode === 'create') {
      const created = await this.createFabric(draft);

      if (created) {
        this.closeFabricDrawer();
      }

      return;
    }

    const updated = await this.updateFabric(this.fabricDrawerOriginalId ?? draft.id, draft);

    if (updated) {
      this.closeFabricDrawer();
    }
  }

  async saveGarmentAccessoryDraft(draft: GarmentAccessoryDialogDraft): Promise<void> {
    if (this.garmentAccessoryDrawerMode === 'view') {
      return;
    }

    if (this.garmentAccessoryDrawerMode === 'create') {
      const created = await this.createGarmentAccessory(draft);

      if (created) {
        this.closeGarmentAccessoryDrawer();
      }

      return;
    }

    const updated = await this.updateGarmentAccessory(
      this.garmentAccessoryDrawerOriginalId ?? draft.id,
      draft,
    );

    if (updated) {
      this.closeGarmentAccessoryDrawer();
    }
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

  private async createFabric(draft: FabricDialogDraft): Promise<boolean> {
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
      return false;
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
      return true;
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Тканину не створено.',
      });
      return false;
    }
  }

  private async updateFabric(id: number, draft: FabricDialogDraft): Promise<boolean> {
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
      return false;
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
      return true;
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: `Тканину №${id} не збережено.`,
      });
      return false;
    }
  }

  private async createGarmentAccessory(draft: GarmentAccessoryDialogDraft): Promise<boolean> {
    if (
      !Number.isFinite(draft.id) ||
      draft.id <= 0 ||
      !draft.name.trim() ||
      draft.price === null ||
      !Number.isFinite(draft.supplierId) ||
      draft.supplierId <= 0
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть усі поля фурнітури перед збереженням.',
      });
      return false;
    }

    try {
      await firstValueFrom(
        this.garmentAccessoriesApi.create({
          id: Number(draft.id),
          name: draft.name,
          price: draft.price,
          supplierName: this.getSupplierNameById(draft.supplierId),
        }),
      );

      this.reloadGarmentAccessoriesPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Фурнітуру №${draft.id} створено.`,
      });
      return true;
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Фурнітуру не створено.',
      });
      return false;
    }
  }

  private async updateGarmentAccessory(
    id: number,
    draft: GarmentAccessoryDialogDraft,
  ): Promise<boolean> {
    if (
      !Number.isFinite(id) ||
      id <= 0 ||
      !draft.name.trim() ||
      draft.price === null ||
      !Number.isFinite(draft.supplierId) ||
      draft.supplierId <= 0 ||
      !this.getSupplierNameById(draft.supplierId)
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть усі поля фурнітури перед збереженням.',
      });
      return false;
    }

    try {
      await firstValueFrom(
        this.garmentAccessoriesApi.update(id, {
          name: draft.name,
          price: draft.price,
          supplierName: this.getSupplierNameById(draft.supplierId),
        }),
      );

      this.reloadGarmentAccessoriesPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Фурнітуру №${id} оновлено.`,
      });
      return true;
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: `Фурнітуру №${id} не збережено.`,
      });
      return false;
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

  private createEmptyFabricDraft(): FabricDialogDraft {
    return {
      id: this.getNextFabricId(),
      name: '',
      price: null,
      providerName: '',
    };
  }

  private createEmptyGarmentAccessoryDraft(): GarmentAccessoryDialogDraft {
    return {
      id: this.getNextGarmentAccessoryId(),
      name: '',
      price: null,
      supplierId: this.suppliers.value()[0]?.id ?? 0,
    };
  }

  private toFabricDraft(fabric: FabricRow): FabricDialogDraft {
    return {
      id: fabric.id,
      name: fabric.name,
      price: fabric.price,
      providerName: fabric.providerName,
    };
  }

  private toGarmentAccessoryDraft(accessory: GarmentAccessoryRow): GarmentAccessoryDialogDraft {
    return {
      id: accessory.id,
      name: accessory.name,
      price: accessory.price,
      supplierId: accessory.supplierId,
    };
  }

  private getSupplierNameById(supplierId: number): string {
    return this.suppliers.value().find((supplier) => supplier.id === supplierId)?.name ?? '';
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

  private openFabricDrawer(
    mode: DialogMode,
    draft: FabricDialogDraft,
    originalId: number | null,
  ): void {
    this.fabricDrawerMode = mode;
    this.fabricDrawerDraft = draft;
    this.fabricDrawerOriginalId = originalId;
    this.fabricDrawerVisible = true;
  }

  private openGarmentAccessoryDrawer(
    mode: DialogMode,
    draft: GarmentAccessoryDialogDraft,
    originalId: number | null,
  ): void {
    this.garmentAccessoryDrawerMode = mode;
    this.garmentAccessoryDrawerDraft = draft;
    this.garmentAccessoryDrawerOriginalId = originalId;
    this.garmentAccessoryDrawerVisible = true;
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
