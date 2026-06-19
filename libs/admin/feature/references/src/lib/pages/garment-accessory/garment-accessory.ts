import { DecimalPipe } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';

import { GarmentAccessoryPageStore } from './garment-accessory-page.store';
import { FabricDialogComponent } from '../../dialogs/fabric-dialog/fabric-dialog.component';
import { GarmentAccessoryDialogComponent } from '../../dialogs/garment-accessory-dialog/garment-accessory-dialog.component';

import type { FabricRow } from '../../data-access/fabrics/fabrics.models';
import type { GarmentAccessoryRow } from '../../data-access/garment-accessories/garment-accessories.models';

@Component({
  selector: 'lib-garment-accessory',
  standalone: true,
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DecimalPipe,
    FabricDialogComponent,
    GarmentAccessoryDialogComponent,
    TableModule,
    TabsModule,
    ToastModule,
  ],
  templateUrl: './garment-accessory.html',
  styleUrl: './garment-accessory.css',
  providers: [ConfirmationService, GarmentAccessoryPageStore, MessageService],
})
export class GarmentAccessory {
  @ViewChild('garmentAccessoryContextMenu')
  private garmentAccessoryContextMenu?: ContextMenu;

  @ViewChild('fabricContextMenu')
  private fabricContextMenu?: ContextMenu;

  protected readonly store = inject(GarmentAccessoryPageStore);
  protected readonly garmentAccessoryMenuItems: MenuItem[] = [
    {
      label: 'Переглянути',
      icon: 'pi pi-eye',
      command: () => {
        if (!this.activeGarmentAccessory) {
          return;
        }

        this.store.openGarmentAccessoryViewDialog(this.activeGarmentAccessory);
      },
    },
    {
      label: 'Редагувати',
      icon: 'pi pi-pencil',
      command: () => {
        if (!this.activeGarmentAccessory) {
          return;
        }

        void this.store.openGarmentAccessoryEditDialog(this.activeGarmentAccessory);
      },
    },
    {
      label: 'Видалити',
      icon: 'pi pi-trash',
      command: () => {
        if (!this.activeGarmentAccessory) {
          return;
        }

        this.store.confirmDeleteGarmentAccessories([this.activeGarmentAccessory]);
      },
    },
  ];

  protected readonly fabricMenuItems: MenuItem[] = [
    {
      label: 'Переглянути',
      icon: 'pi pi-eye',
      command: () => {
        if (!this.activeFabric) {
          return;
        }

        this.store.openFabricViewDialog(this.activeFabric);
      },
    },
    {
      label: 'Редагувати',
      icon: 'pi pi-pencil',
      command: () => {
        if (!this.activeFabric) {
          return;
        }

        void this.store.openFabricEditDialog(this.activeFabric);
      },
    },
    {
      label: 'Видалити',
      icon: 'pi pi-trash',
      command: () => {
        if (!this.activeFabric) {
          return;
        }

        this.store.confirmDeleteFabrics([this.activeFabric]);
      },
    },
  ];

  protected activeGarmentAccessory: GarmentAccessoryRow | null = null;
  protected activeFabric: FabricRow | null = null;
}
