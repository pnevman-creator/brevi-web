import { Component, ViewChild, inject } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { SupplierPageStore } from './supplier-page.store';
import { SupplierDialogComponent } from '../../dialogs/supplier-dialog/supplier-dialog.component';

import type { SupplierRow } from '../../data-access/suppliers/suppliers.models';

@Component({
  selector: 'lib-supplier',
  standalone: true,
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    ContextMenuModule,
    SupplierDialogComponent,
    TableModule,
    ToastModule,
  ],
  templateUrl: './supplier.html',
  styleUrl: './supplier.css',
  providers: [ConfirmationService, SupplierPageStore, MessageService],
})
export class Supplier {
  @ViewChild('supplierContextMenu')
  private supplierContextMenu?: ContextMenu;

  protected readonly store = inject(SupplierPageStore);
  protected readonly supplierMenuItems: MenuItem[] = [
    {
      label: 'Переглянути',
      icon: 'pi pi-eye',
      command: () => {
        if (!this.activeSupplier) {
          return;
        }

        this.store.openSupplierViewDialog(this.activeSupplier);
      },
    },
    {
      label: 'Редагувати',
      icon: 'pi pi-pencil',
      command: () => {
        if (!this.activeSupplier) {
          return;
        }

        void this.store.openSupplierEditDialog(this.activeSupplier);
      },
    },
    {
      label: 'Видалити',
      icon: 'pi pi-trash',
      command: () => {
        if (!this.activeSupplier) {
          return;
        }

        this.store.confirmDeleteSuppliers([this.activeSupplier]);
      },
    },
  ];

  protected activeSupplier: SupplierRow | null = null;
}
