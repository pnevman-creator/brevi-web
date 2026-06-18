import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';

import { GarmentPartOperationPageStore } from './garment-part-operation-page.store';

@Component({
  selector: 'lib-garment-part-operation',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    DecimalPipe,
    DynamicDialogModule,
    TableModule,
    TabsModule,
    ToastModule,
  ],
  templateUrl: './garment-part-operation.html',
  styleUrl: './garment-part-operation.css',
  providers: [ConfirmationService, DialogService, GarmentPartOperationPageStore, MessageService],
})
export class GarmentPartOperation {
  protected readonly store = inject(GarmentPartOperationPageStore);
}
