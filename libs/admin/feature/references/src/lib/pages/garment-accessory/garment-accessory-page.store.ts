import { DOCUMENT } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { firstValueFrom, Observable, tap } from 'rxjs';

import { FabricsApi } from '../../data-access/fabrics/fabrics.api';
import { GarmentAccessoriesApi } from '../../data-access/garment-accessories/garment-accessories.api';

import type {
  CreateFabricRequest,
  FabricRow,
  UpdateFabricRequest,
} from '../../data-access/fabrics/fabrics.models';
import type {
  CreateGarmentAccessoryRequest,
  GarmentAccessoryRow,
  UpdateGarmentAccessoryRequest,
} from '../../data-access/garment-accessories/garment-accessories.models';
import type { SupplierRow } from '../../data-access/suppliers/suppliers.models';

interface FabricDraft {
  id: number;
  name: string;
  price: number | null;
  providerName: string;
}

interface GarmentAccessoryDraft {
  id: number;
  name: string;
  price: number | null;
}

@Injectable()
export class GarmentAccessoryPageStore {
  private readonly fabricsApi = inject(FabricsApi);
  private readonly garmentAccessoriesApi = inject(GarmentAccessoriesApi);
  private readonly messageService = inject(MessageService);
  private readonly document = inject(DOCUMENT);
  private readonly clonedFabrics: Record<number, FabricRow> = {};
  private readonly clonedGarmentAccessories: Record<number, GarmentAccessoryRow> = {};

  selectedFabrics: FabricRow[] = [];
  selectedGarmentAccessories: GarmentAccessoryRow[] = [];
  fabricDraft: FabricDraft | null = null;
  garmentAccessoryDraft: GarmentAccessoryDraft | null = null;

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

  beginFabricEdit(fabric: FabricRow): void {
    this.clonedFabrics[fabric.id] = { ...fabric };
  }

  beginGarmentAccessoryEdit(accessory: GarmentAccessoryRow): void {
    this.clonedGarmentAccessories[accessory.id] = { ...accessory };
  }

  beginFabricCreate(): void {
    this.fabricDraft = {
      id: this.getNextFabricId(),
      name: '',
      price: null,
      providerName: '',
    };
  }

  cancelFabricCreate(): void {
    this.fabricDraft = null;
  }

  beginGarmentAccessoryCreate(): void {
    this.garmentAccessoryDraft = {
      id: this.getNextGarmentAccessoryId(),
      name: '',
      price: null,
    };
  }

  cancelGarmentAccessoryCreate(): void {
    this.garmentAccessoryDraft = null;
  }

  async saveFabric(fabric: FabricRow): Promise<void> {
    try {
      await firstValueFrom(
        this.updateFabric(fabric.id, {
          name: fabric.name,
          price: Number(fabric.price),
          providerName: fabric.providerName,
        }),
      );

      delete this.clonedFabrics[fabric.id];
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Тканину №${fabric.id} оновлено.`,
      });
    } catch {
      this.restoreFabric(fabric.id);
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: `Тканину №${fabric.id} не збережено.`,
      });
    }
  }

  async saveFabricDraft(): Promise<void> {
    if (
      !this.fabricDraft ||
      !Number.isFinite(this.fabricDraft.id) ||
      this.fabricDraft.id <= 0 ||
      !this.fabricDraft.name.trim() ||
      this.fabricDraft.price === null ||
      !this.fabricDraft.providerName.trim()
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
          id: Number(this.fabricDraft.id),
          name: this.fabricDraft.name,
          price: this.fabricDraft.price,
          providerName: this.fabricDraft.providerName,
        }),
      );

      this.fabricDraft = null;
      this.reloadFabricsPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: 'Тканину створено.',
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Тканину не створено.',
      });
    }
  }

  cancelFabricEdit(fabric: FabricRow): void {
    this.restoreFabric(fabric.id);
  }

  async saveGarmentAccessory(accessory: GarmentAccessoryRow): Promise<void> {
    try {
      await firstValueFrom(
        this.updateGarmentAccessory(accessory.id, {
          name: accessory.name,
          price: Number(accessory.price),
        }),
      );

      delete this.clonedGarmentAccessories[accessory.id];
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Фурнітуру №${accessory.id} оновлено.`,
      });
    } catch {
      this.restoreGarmentAccessory(accessory.id);
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: `Фурнітуру №${accessory.id} не збережено.`,
      });
    }
  }

  async saveGarmentAccessoryDraft(): Promise<void> {
    if (
      !this.garmentAccessoryDraft ||
      !Number.isFinite(this.garmentAccessoryDraft.id) ||
      this.garmentAccessoryDraft.id <= 0 ||
      !this.garmentAccessoryDraft.name.trim() ||
      this.garmentAccessoryDraft.price === null
    ) {
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
          id: Number(this.garmentAccessoryDraft.id),
          name: this.garmentAccessoryDraft.name,
          price: this.garmentAccessoryDraft.price,
        }),
      );

      this.garmentAccessoryDraft = null;
      this.reloadGarmentAccessoriesPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: 'Фурнітуру створено.',
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Фурнітуру не створено.',
      });
    }
  }

  cancelGarmentAccessoryEdit(accessory: GarmentAccessoryRow): void {
    this.restoreGarmentAccessory(accessory.id);
  }

  createFabric(request: CreateFabricRequest): Observable<number> {
    return this.fabricsApi.create(request).pipe(tap(() => this.reloadFabricsPreservingScroll()));
  }

  updateFabric(id: number, request: UpdateFabricRequest): Observable<void> {
    return this.fabricsApi
      .update(id, request)
      .pipe(tap(() => this.reloadFabricsPreservingScroll()));
  }

  deleteFabric(id: number): Observable<void> {
    return this.fabricsApi.delete(id).pipe(tap(() => this.reloadFabricsPreservingScroll()));
  }

  createGarmentAccessory(request: CreateGarmentAccessoryRequest): Observable<number> {
    return this.garmentAccessoriesApi
      .create(request)
      .pipe(tap(() => this.reloadGarmentAccessoriesPreservingScroll()));
  }

  updateGarmentAccessory(id: number, request: UpdateGarmentAccessoryRequest): Observable<void> {
    return this.garmentAccessoriesApi
      .update(id, request)
      .pipe(tap(() => this.reloadGarmentAccessoriesPreservingScroll()));
  }

  deleteGarmentAccessory(id: number): Observable<void> {
    return this.garmentAccessoriesApi
      .delete(id)
      .pipe(tap(() => this.reloadGarmentAccessoriesPreservingScroll()));
  }

  private getNextFabricId(): number {
    return this.getNextId(this.fabrics.value());
  }

  private getNextGarmentAccessoryId(): number {
    return this.getNextId(this.garmentAccessories.value());
  }

  async deleteSelectedFabrics(): Promise<void> {
    if (!this.selectedFabrics.length) {
      return;
    }

    const selectedIds = this.selectedFabrics.map((fabric) => fabric.id);
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

  async deleteSelectedGarmentAccessories(): Promise<void> {
    if (!this.selectedGarmentAccessories.length) {
      return;
    }

    const selectedIds = this.selectedGarmentAccessories.map((accessory) => accessory.id);
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

  private restoreFabric(id: number): void {
    const clone = this.clonedFabrics[id];

    if (!clone) {
      return;
    }

    const fabrics = this.fabrics.value();
    const index = fabrics.findIndex((fabric) => fabric.id === id);

    if (index !== -1) {
      fabrics[index] = clone;
    }

    delete this.clonedFabrics[id];
  }

  private restoreGarmentAccessory(id: number): void {
    const clone = this.clonedGarmentAccessories[id];

    if (!clone) {
      return;
    }

    const garmentAccessories = this.garmentAccessories.value();
    const index = garmentAccessories.findIndex((accessory) => accessory.id === id);

    if (index !== -1) {
      garmentAccessories[index] = clone;
    }

    delete this.clonedGarmentAccessories[id];
  }

  private getNextId(items: Array<{ id: number }>): number {
    const maxId = items.reduce((currentMax, item) => Math.max(currentMax, item.id), 0);

    return maxId + 1;
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
