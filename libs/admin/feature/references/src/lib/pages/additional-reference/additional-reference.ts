import { Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { AdditionalReferencePageStore } from './additional-reference-page.store';

@Component({
  selector: 'lib-additional-reference',
  imports: [ButtonModule, DynamicDialogModule, TableModule, ToastModule],
  templateUrl: './additional-reference.html',
  styleUrl: './additional-reference.css',
  providers: [DialogService, AdditionalReferencePageStore, MessageService],
})
export class AdditionalReference {
  protected readonly store = inject(AdditionalReferencePageStore);

  protected formatNumber(value: number): string {
    return new Intl.NumberFormat('uk-UA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }
}
