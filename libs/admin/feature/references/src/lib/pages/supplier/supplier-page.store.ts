import { DOCUMENT } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import { SuppliersApi } from '../../data-access/suppliers/suppliers.api';

import type {
  CreateSupplierRequest,
  SupplierRow,
  UpdateSupplierRequest,
} from '../../data-access/suppliers/suppliers.models';
import type {
  SupplierDialogDraft,
  SupplierDialogMode,
} from '../../dialogs/reference-dialog.models';

@Injectable()
export class SupplierPageStore {
  private readonly suppliersApi = inject(SuppliersApi);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly document = inject(DOCUMENT);

  selectedSuppliers: SupplierRow[] = [];
  readonly suppliers = httpResource<SupplierRow[]>(() => '/api/reference/suppliers', {
    defaultValue: [],
  });
  private _supplierDrawerVisible = false;
  supplierDrawerMode: SupplierDialogMode = 'create';
  supplierDrawerDraft: SupplierDialogDraft = this.createEmptySupplierDraft();
  private supplierDrawerOriginalId: number | null = null;

  get supplierDrawerVisible(): boolean {
    return this._supplierDrawerVisible;
  }

  set supplierDrawerVisible(visible: boolean) {
    this._supplierDrawerVisible = visible;

    if (!visible) {
      this.supplierDrawerMode = 'create';
      this.supplierDrawerDraft = this.createEmptySupplierDraft();
      this.supplierDrawerOriginalId = null;
    }
  }

  openSupplierCreateDialog(): void {
    this.openSupplierDrawer('create', this.createEmptySupplierDraft(), null);
  }

  openSupplierEditDialog(supplier: SupplierRow): void {
    this.openSupplierDrawer('edit', this.toSupplierDraft(supplier), supplier.id);
  }

  openSupplierViewDialog(supplier: SupplierRow): void {
    this.openSupplierDrawer('view', this.toSupplierDraft(supplier), supplier.id);
  }

  closeSupplierDrawer(): void {
    this.supplierDrawerVisible = false;
  }

  async saveSupplierDraft(draft: SupplierDialogDraft): Promise<void> {
    if (this.supplierDrawerMode === 'view') {
      return;
    }

    if (this.supplierDrawerMode === 'create') {
      const created = await this.createSupplier(draft);

      if (created) {
        this.closeSupplierDrawer();
      }

      return;
    }

    const updated = await this.updateSupplier(this.supplierDrawerOriginalId ?? draft.id, draft);

    if (updated) {
      this.closeSupplierDrawer();
    }
  }

  confirmDeleteSuppliers(suppliers: SupplierRow[]): void {
    if (!suppliers.length) {
      return;
    }

    const selectedIds = suppliers.map((supplier) => supplier.id);
    this.confirmationService.confirm({
      header: 'Підтвердження видалення',
      message: `Ви впевнені, що хочете видалити ${this.formatDeletionCount(selectedIds.length)}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Видалити',
      rejectLabel: 'Скасувати',
      accept: () => {
        void this.deleteSuppliersByIds(selectedIds);
      },
    });
  }

  private async createSupplier(draft: SupplierDialogDraft): Promise<boolean> {
    if (!Number.isFinite(draft.id) || draft.id <= 0 || !draft.name.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть назву постачальника перед збереженням.',
      });
      return false;
    }

    try {
      await firstValueFrom(this.suppliersApi.create(this.toCreateSupplierRequest(draft)));

      this.reloadSuppliersPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Постачальника №${draft.id} створено.`,
      });
      return true;
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Постачальника не створено.',
      });
      return false;
    }
  }

  private async updateSupplier(id: number, draft: SupplierDialogDraft): Promise<boolean> {
    if (!Number.isFinite(id) || id <= 0 || !draft.name.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть назву постачальника перед збереженням.',
      });
      return false;
    }

    try {
      await firstValueFrom(this.suppliersApi.update(id, this.toUpdateSupplierRequest(draft)));

      this.reloadSuppliersPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Постачальника №${id} оновлено.`,
      });
      return true;
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: `Постачальника №${id} не збережено.`,
      });
      return false;
    }
  }

  private async deleteSuppliersByIds(selectedIds: number[]): Promise<void> {
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

  private getNextSupplierId(): number {
    const maxId = this.suppliers
      .value()
      .reduce((currentMax, supplier) => Math.max(currentMax, supplier.id), 0);

    return maxId + 1;
  }

  private createEmptySupplierDraft(): SupplierDialogDraft {
    return {
      id: this.getNextSupplierId(),
      name: '',
      link: '',
      contactPerson: '',
      phoneNumber: '',
      notes: '',
    };
  }

  private toSupplierDraft(supplier: SupplierRow): SupplierDialogDraft {
    return {
      id: supplier.id,
      name: supplier.name,
      link: supplier.link ?? '',
      contactPerson: supplier.contactPerson ?? '',
      phoneNumber: supplier.phoneNumber ?? '',
      notes: supplier.notes ?? '',
    };
  }

  private toCreateSupplierRequest(draft: SupplierDialogDraft): CreateSupplierRequest {
    return {
      id: Number(draft.id),
      name: draft.name,
      link: draft.link || null,
      contactPerson: draft.contactPerson || null,
      phoneNumber: draft.phoneNumber || null,
      notes: draft.notes || null,
    };
  }

  private toUpdateSupplierRequest(draft: SupplierDialogDraft): UpdateSupplierRequest {
    return {
      name: draft.name,
      link: draft.link || null,
      contactPerson: draft.contactPerson || null,
      phoneNumber: draft.phoneNumber || null,
      notes: draft.notes || null,
    };
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

  private openSupplierDrawer(
    mode: SupplierDialogMode,
    draft: SupplierDialogDraft,
    originalId: number | null,
  ): void {
    this.supplierDrawerMode = mode;
    this.supplierDrawerDraft = draft;
    this.supplierDrawerOriginalId = originalId;
    this.supplierDrawerVisible = true;
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
    queueMicrotask(() => {
      const mainElement = this.document.querySelector('main');

      if (!(mainElement instanceof HTMLElement)) {
        return;
      }

      mainElement.scrollTop = position.top;
      mainElement.scrollLeft = position.left;
    });
  }
}
