import { DOCUMENT } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';

import { SuppliersApi } from '../../data-access/suppliers/suppliers.api';
import { SupplierDialogComponent } from '../../dialogs/supplier-dialog/supplier-dialog.component';

import type { SupplierRow } from '../../data-access/suppliers/suppliers.models';
import type {
  SupplierDialogData,
  SupplierDialogDraft,
  SupplierDialogResult,
} from '../../dialogs/reference-dialog.models';

@Injectable()
export class SupplierPageStore {
  private readonly suppliersApi = inject(SuppliersApi);
  private readonly dialogService = inject(DialogService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly document = inject(DOCUMENT);

  selectedSuppliers: SupplierRow[] = [];

  readonly suppliers = httpResource<SupplierRow[]>(() => '/api/reference/suppliers', {
    defaultValue: [],
  });

  async openSupplierCreateDialog(): Promise<void> {
    const draft = await this.openSupplierDialog({
      mode: 'create',
      draft: {
        id: this.getNextSupplierId(),
        name: '',
        link: '',
        contactPerson: '',
        phoneNumber: '',
      },
    });

    if (!draft) {
      return;
    }

    await this.createSupplier(draft.draft);
  }

  async openSupplierEditDialog(supplier: SupplierRow): Promise<void> {
    const draft = await this.openSupplierDialog({
      mode: 'edit',
      draft: {
        id: supplier.id,
        name: supplier.name,
        link: supplier.link ?? '',
        contactPerson: supplier.contactPerson ?? '',
        phoneNumber: supplier.phoneNumber ?? '',
      },
    });

    if (!draft) {
      return;
    }

    await this.updateSupplier(draft.originalId ?? supplier.id, draft.draft);
  }

  private openSupplierDialog(data: SupplierDialogData): Promise<SupplierDialogResult | null> {
    const ref = this.dialogService.open(SupplierDialogComponent, {
      data,
      header: data.mode === 'create' ? 'Нова позиція' : 'Редагування постачальника',
      modal: true,
      draggable: false,
      resizable: false,
      width: '32rem',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
    })!;

    return firstValueFrom(ref.onClose);
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

  private async createSupplier(draft: SupplierDialogDraft): Promise<void> {
    if (!Number.isFinite(draft.id) || draft.id <= 0 || !draft.name.trim()) {
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
          id: Number(draft.id),
          name: draft.name,
          link: draft.link || null,
          contactPerson: draft.contactPerson || null,
          phoneNumber: draft.phoneNumber || null,
        }),
      );

      this.reloadSuppliersPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Постачальника №${draft.id} створено.`,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Постачальника не створено.',
      });
    }
  }

  private async updateSupplier(id: number, draft: SupplierDialogDraft): Promise<void> {
    if (!Number.isFinite(id) || id <= 0 || !draft.name.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть назву постачальника перед збереженням.',
      });
      return;
    }

    try {
      await firstValueFrom(
        this.suppliersApi.update(id, {
          name: draft.name,
          link: draft.link || null,
          contactPerson: draft.contactPerson || null,
          phoneNumber: draft.phoneNumber || null,
        }),
      );

      this.reloadSuppliersPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Постачальника №${id} оновлено.`,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: `Постачальника №${id} не збережено.`,
      });
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
