import { DOCUMENT } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';

import { AdditionalReferencesApi } from '../../data-access/additional-references/additional-references.api';
import { AdditionalReferenceDialogComponent } from '../../dialogs/additional-reference-dialog/additional-reference-dialog.component';

import type { AdditionalReferenceRow } from '../../data-access/additional-references/additional-references.models';
import type {
  AdditionalReferenceDialogData,
  AdditionalReferenceDialogResult,
} from '../../dialogs/additional-reference-dialog/additional-reference-dialog.models';

@Injectable()
export class AdditionalReferencePageStore {
  private readonly additionalReferencesApi = inject(AdditionalReferencesApi);
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private readonly document = inject(DOCUMENT);

  readonly additionalReferences = httpResource<AdditionalReferenceRow[]>(
    () => '/api/reference/additional-references',
    {
      defaultValue: [],
    },
  );

  async openAdditionalReferenceEditDialog(item: AdditionalReferenceRow): Promise<void> {
    const draft = await this.openAdditionalReferenceDialog({
      mode: 'edit',
      draft: {
        id: item.id,
        name: item.name,
        key: item.key,
        value: item.value,
        unit: item.unit,
        description: item.description ?? '',
      },
    });

    if (!draft) {
      return;
    }

    await this.updateAdditionalReference(draft.originalId ?? item.id, draft.draft);
  }

  private openAdditionalReferenceDialog(
    data: AdditionalReferenceDialogData,
  ): Promise<AdditionalReferenceDialogResult | null> {
    const ref = this.dialogService.open(AdditionalReferenceDialogComponent, {
      data,
      header: data.mode === 'create' ? 'Нова позиція' : 'Редагування позиції',
      modal: true,
      draggable: false,
      resizable: false,
      width: '36rem',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
    })!;

    return firstValueFrom(ref.onClose);
  }

  private async updateAdditionalReference(
    id: number,
    draft: {
      id: number;
      name: string;
      key: string;
      value: number | null;
      unit: string;
      description: string;
    },
  ): Promise<void> {
    if (
      !Number.isFinite(id) ||
      id <= 0 ||
      !draft.name.trim() ||
      !draft.key.trim() ||
      draft.value === null ||
      !Number.isFinite(draft.value) ||
      !draft.unit.trim()
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: 'Заповніть усі поля додаткового довідника перед збереженням.',
      });
      return;
    }

    try {
      await firstValueFrom(
        this.additionalReferencesApi.update(id, {
          name: draft.name,
          key: draft.key,
          value: Number(draft.value),
          unit: draft.unit,
          description: draft.description || null,
        }),
      );

      this.reloadAdditionalReferencesPreservingScroll();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Додатковий довідник №${id} оновлено.`,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: `Додатковий довідник №${id} не збережено.`,
      });
    }
  }

  private reloadAdditionalReferencesPreservingScroll(): void {
    const scrollPosition = this.getMainScrollPosition();
    this.additionalReferences.reload();
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
