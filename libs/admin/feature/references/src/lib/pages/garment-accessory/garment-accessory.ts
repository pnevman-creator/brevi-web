import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';

import { GarmentAccessoryPageStore } from './garment-accessory-page.store';

@Component({
  selector: 'lib-garment-accessory',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    DecimalPipe,
    DynamicDialogModule,
    TableModule,
    TabsModule,
    ToastModule,
  ],
  templateUrl: './garment-accessory.html',
  styleUrl: './garment-accessory.css',
  providers: [ConfirmationService, DialogService, GarmentAccessoryPageStore, MessageService],
})
export class GarmentAccessory {
  protected readonly store = inject(GarmentAccessoryPageStore);
}
