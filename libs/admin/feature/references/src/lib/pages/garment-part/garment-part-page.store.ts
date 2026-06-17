import { DOCUMENT } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';

import { GarmentPartsApi } from '../../data-access/garment-parts/garment-parts.api';
import { GarmentPartDialogComponent } from '../../dialogs/garment-part-dialog/garment-part-dialog.component';

import type { GarmentPartRow } from '../../data-access/garment-parts/garment-parts.models';
import type { SupplierRow } from '../../data-access/suppliers/suppliers.models';
import type {
  GarmentPartDialogData,
  GarmentPartDialogDraft,
  GarmentPartDialogResult,
} from '../../dialogs/reference-dialog.models';

@Injectable()
export class GarmentPartPageStore {
  private readonly garmentPartsApi = inject(GarmentPartsApi);
  private readonly dialogService = inject(DialogService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly document = inject(DOCUMENT);

  selectedGarmentParts: GarmentPartRow[] = [];

  readonly garmentParts = httpResource<GarmentPartRow[]>(() => '/api/reference/garment-parts', {
    defaultValue: [],
  });

  readonly suppliers = httpResource<SupplierRow[]>(() => '/api/reference/suppliers', {
    defaultValue: [],
  });

  async openGarmentPartCreateDialog(): Promise<void> {
    const draft = await this.openGarmentPartDialog({
      mode: 'create',
      draft: {
        id: this.getNextGarmentPartId(),
        name: '',
        supplierId: this.suppliers.value()[0]?.id ?? 0,
        contactPerson: '',
        phoneNumber: '',
      },
      suppliers: this.suppliers.value(),
    });

    if (!draft) {
      return;
    }

    await this.createGarmentPart(draft.draft);
  }

  async openGarmentPartEditDialog(part: GarmentPartRow): Promise<void> {
    const draft = await this.openGarmentPartDialog({
      mode: 'edit',
      draft: {
        id: part.id,
        name: part.name,
        supplierId: part.supplierId,
        contactPerson: part.contactPerson ?? '',
        phoneNumber: part.phoneNumber ?? '',
      },
      suppliers: this.suppliers.value(),
    });

    if (!draft) {
      return;
    }

    await this.updateGarmentPart(draft.originalId ?? part.id, draft.draft);
  }

  private openGarmentPartDialog(
    data: GarmentPartDialogData,
  ): Promise<GarmentPartDialogResult | null> {
    const ref = this.dialogService.open(GarmentPartDialogComponent, {
      data,
      header: data.mode === 'create' ? 'Нова частина виробу' : 'Редагування частини виробу',
      modal: true,
      draggable: false,
      resizable: false,
      width: '36rem',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
    })!;

    return firstValueFrom(ref.onClose);
  }

  confirmDeleteGarmentParts(parts: GarmentPartRow[]): void {
    if (!parts.length) {
      return;
    }

    const selectedIds = parts.map((part) => part.id);
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

  private async createGarmentPart(draft: GarmentPartDialogDraft): Promise<void> {
    if (
      !Number.isFinite(draft.id) ||
      draft.id <= 0 ||
      !draft.name.trim() ||
      !Number.isFinite(draft.supplierId) ||
      draft.supplierId <= 0
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть усі поля частини виробу перед збереженням.',
      });
      return;
    }

    try {
      await firstValueFrom(
        this.garmentPartsApi.create({
          id: Number(draft.id),
          name: draft.name,
          supplierId: draft.supplierId,
          contactPerson: draft.contactPerson || null,
          phoneNumber: draft.phoneNumber || null,
        }),
      );

      this.reloadGarmentPartsPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Частину виробу №${draft.id} створено.`,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Частину виробу не створено.',
      });
    }
  }

  private async updateGarmentPart(id: number, draft: GarmentPartDialogDraft): Promise<void> {
    if (
      !Number.isFinite(id) ||
      id <= 0 ||
      !draft.name.trim() ||
      !Number.isFinite(draft.supplierId) ||
      draft.supplierId <= 0
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть усі поля частини виробу перед збереженням.',
      });
      return;
    }

    try {
      await firstValueFrom(
        this.garmentPartsApi.update(id, {
          name: draft.name,
          supplierId: draft.supplierId,
          contactPerson: draft.contactPerson || null,
          phoneNumber: draft.phoneNumber || null,
        }),
      );

      this.reloadGarmentPartsPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Частину виробу №${id} оновлено.`,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: `Частину виробу №${id} не збережено.`,
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
          ? 'Вибрані частини виробу видалено.'
          : `Видалено ${selectedIds.length - failedCount} з ${selectedIds.length} частин виробу.`,
    });
  }

  private getNextGarmentPartId(): number {
    const maxId = this.garmentParts
      .value()
      .reduce((currentMax, item) => Math.max(currentMax, item.id), 0);

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
