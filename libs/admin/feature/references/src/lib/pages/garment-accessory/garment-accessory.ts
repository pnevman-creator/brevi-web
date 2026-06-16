import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';

import { GarmentAccessoryPageStore } from './garment-accessory-page.store';

@Component({
  selector: 'lib-garment-accessory',
  imports: [
    ButtonModule,
    DecimalPipe,
    FormsModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TabsModule,
    ToastModule,
  ],
  templateUrl: './garment-accessory.html',
  styleUrl: './garment-accessory.css',
  providers: [GarmentAccessoryPageStore, MessageService],
})
export class GarmentAccessory {
  protected readonly store = inject(GarmentAccessoryPageStore);
}
