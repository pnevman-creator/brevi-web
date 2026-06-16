import { DOCUMENT } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { SuppliersApi } from '../../data-access/suppliers/suppliers.api';

import type { SupplierRow } from '../../data-access/suppliers/suppliers.models';

interface SupplierDraft {
  id: number;
  name: string;
  link: string;
}

@Injectable()
export class SupplierPageStore {
  private readonly suppliersApi = inject(SuppliersApi);
  private readonly messageService = inject(MessageService);
  private readonly document = inject(DOCUMENT);
  private readonly clonedSuppliers: Record<number, SupplierRow> = {};

  selectedSuppliers: SupplierRow[] = [];
  supplierDraft: SupplierDraft | null = null;

  readonly suppliers = httpResource<SupplierRow[]>(() => '/api/reference/suppliers', {
    defaultValue: [],
  });

  beginSupplierEdit(supplier: SupplierRow): void {
    this.clonedSuppliers[supplier.id] = { ...supplier };
  }

  beginSupplierCreate(): void {
    this.supplierDraft = {
      id: this.getNextSupplierId(),
      name: '',
      link: '',
    };
  }

  cancelSupplierCreate(): void {
    this.supplierDraft = null;
  }

  async saveSupplier(supplier: SupplierRow): Promise<void> {
    try {
      await firstValueFrom(
        this.suppliersApi.update(supplier.id, {
          name: supplier.name,
          link: supplier.link,
        }),
      );

      delete this.clonedSuppliers[supplier.id];
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Постачальника №${supplier.id} оновлено.`,
      });
    } catch {
      this.restoreSupplier(supplier.id);
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: `Постачальника №${supplier.id} не збережено.`,
      });
    }
  }

  cancelSupplierEdit(supplier: SupplierRow): void {
    this.restoreSupplier(supplier.id);
  }

  async saveSupplierDraft(): Promise<void> {
    if (
      !this.supplierDraft ||
      !Number.isFinite(this.supplierDraft.id) ||
      this.supplierDraft.id <= 0 ||
      !this.supplierDraft.name.trim()
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть назву постачальника перед збереженням.',
      });
      return;
    }

    try {
      await firstValueFrom(
        this.suppliersApi.create({
          id: Number(this.supplierDraft.id),
          name: this.supplierDraft.name,
          link: this.supplierDraft.link,
        }),
      );

      this.supplierDraft = null;
      this.reloadSuppliersPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: 'Постачальника створено.',
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Постачальника не створено.',
      });
    }
  }

  async deleteSelectedSuppliers(): Promise<void> {
    if (!this.selectedSuppliers.length) {
      return;
    }

    const selectedIds = this.selectedSuppliers.map((supplier) => supplier.id);
    const results = await Promise.allSettled(
      selectedIds.map((id) => firstValueFrom(this.suppliersApi.delete(id))),
    );

    this.selectedSuppliers = [];
    this.reloadSuppliersPreservingScroll();

    const failedCount = results.filter((result) => result.status === 'rejected').length;
    this.messageService.add({
      severity: failedCount === 0 ? 'success' : 'error',
      summary: failedCount === 0 ? 'Видалено' : 'Помилка видалення',
      detail:
        failedCount === 0
          ? 'Вибраних постачальників видалено.'
          : `Видалено ${selectedIds.length - failedCount} з ${selectedIds.length} постачальників.`,
    });
  }

  private restoreSupplier(id: number): void {
    const clone = this.clonedSuppliers[id];

    if (!clone) {
      return;
    }

    const suppliers = this.suppliers.value();
    const index = suppliers.findIndex((supplier) => supplier.id === id);

    if (index !== -1) {
      suppliers[index] = clone;
    }

    delete this.clonedSuppliers[id];
  }

  private getNextSupplierId(): number {
    const maxId = this.suppliers
      .value()
      .reduce((currentMax, supplier) => Math.max(currentMax, supplier.id), 0);

    return maxId + 1;
  }

  private reloadSuppliersPreservingScroll(): void {
    const scrollPosition = this.getMainScrollPosition();
    this.suppliers.reload();
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
