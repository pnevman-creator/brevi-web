import { DecimalPipe } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';

import { GarmentPartOperationPageStore } from './garment-part-operation-page.store';
import { GarmentPartDialogComponent } from '../../dialogs/garment-part-dialog/garment-part-dialog.component';
import { GarmentPartOperationDialogComponent } from '../../dialogs/garment-part-operation-dialog/garment-part-operation-dialog.component';

import type { GarmentPartOperationRow } from '../../data-access/garment-part-operations/garment-part-operations.models';
import type { GarmentPartRow } from '../../data-access/garment-parts/garment-parts.models';

@Component({
  selector: 'lib-garment-part-operation',
  standalone: true,
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DecimalPipe,
    GarmentPartDialogComponent,
    GarmentPartOperationDialogComponent,
    TableModule,
    TabsModule,
    ToastModule,
  ],
  templateUrl: './garment-part-operation.html',
  styleUrl: './garment-part-operation.css',
  providers: [ConfirmationService, GarmentPartOperationPageStore, MessageService],
})
export class GarmentPartOperation {
  @ViewChild('garmentPartOperationContextMenu')
  private garmentPartOperationContextMenu?: ContextMenu;

  @ViewChild('garmentPartContextMenu')
  private garmentPartContextMenu?: ContextMenu;

  protected readonly store = inject(GarmentPartOperationPageStore);
  protected readonly garmentPartOperationMenuItems: MenuItem[] = [
    {
      label: 'Переглянути',
      icon: 'pi pi-eye',
      command: () => {
        if (!this.activeGarmentPartOperation) {
          return;
        }

        this.store.openGarmentPartOperationViewDialog(this.activeGarmentPartOperation);
      },
    },
    {
      label: 'Редагувати',
      icon: 'pi pi-pencil',
      command: () => {
        if (!this.activeGarmentPartOperation) {
          return;
        }

        void this.store.openGarmentPartOperationEditDialog(this.activeGarmentPartOperation);
      },
    },
    {
      label: 'Видалити',
      icon: 'pi pi-trash',
      command: () => {
        if (!this.activeGarmentPartOperation) {
          return;
        }

        this.store.confirmDeleteGarmentPartOperations([this.activeGarmentPartOperation]);
      },
    },
  ];

  protected readonly garmentPartMenuItems: MenuItem[] = [
    {
      label: 'Переглянути',
      icon: 'pi pi-eye',
      command: () => {
        if (!this.activeGarmentPart) {
          return;
        }

        this.store.openGarmentPartViewDialog(this.activeGarmentPart);
      },
    },
    {
      label: 'Редагувати',
      icon: 'pi pi-pencil',
      command: () => {
        if (!this.activeGarmentPart) {
          return;
        }

        void this.store.openGarmentPartEditDialog(this.activeGarmentPart);
      },
    },
    {
      label: 'Видалити',
      icon: 'pi pi-trash',
      command: () => {
        if (!this.activeGarmentPart) {
          return;
        }

        this.store.confirmDeleteGarmentParts([this.activeGarmentPart]);
      },
    },
  ];

  protected activeGarmentPartOperation: GarmentPartOperationRow | null = null;
  protected activeGarmentPart: GarmentPartRow | null = null;
}
