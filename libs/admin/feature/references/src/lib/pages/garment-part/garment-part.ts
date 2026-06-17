import { Component, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { GarmentPartPageStore } from './garment-part-page.store';

@Component({
  selector: 'lib-garment-part',
  imports: [ButtonModule, ConfirmDialogModule, DynamicDialogModule, TableModule, ToastModule],
  templateUrl: './garment-part.html',
  styleUrl: './garment-part.css',
  providers: [ConfirmationService, DialogService, GarmentPartPageStore, MessageService],
})
export class GarmentPart {
  protected readonly store = inject(GarmentPartPageStore);
}
