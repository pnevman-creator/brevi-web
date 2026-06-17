import { Component, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { SupplierPageStore } from './supplier-page.store';

@Component({
  selector: 'lib-supplier',
  imports: [ButtonModule, ConfirmDialogModule, DynamicDialogModule, TableModule, ToastModule],
  templateUrl: './supplier.html',
  styleUrl: './supplier.css',
  providers: [ConfirmationService, DialogService, SupplierPageStore, MessageService],
})
export class Supplier {
  protected readonly store = inject(SupplierPageStore);
}
