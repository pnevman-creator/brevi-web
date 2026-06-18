import { DecimalPipe } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';

import { GarmentAccessoryPageStore } from './garment-accessory-page.store';

import type { FabricRow } from '../../data-access/fabrics/fabrics.models';
import type { GarmentAccessoryRow } from '../../data-access/garment-accessories/garment-accessories.models';

@Component({
  selector: 'lib-garment-accessory',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    ContextMenuModule,
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
  @ViewChild('garmentAccessoryContextMenu')
  private garmentAccessoryContextMenu?: ContextMenu;

  @ViewChild('fabricContextMenu')
  private fabricContextMenu?: ContextMenu;

  protected readonly store = inject(GarmentAccessoryPageStore);
  protected readonly garmentAccessoryMenuItems: MenuItem[] = [
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

  protected openGarmentAccessoryContextMenu(
    event: MouseEvent,
    accessory: GarmentAccessoryRow,
  ): void {
    event.preventDefault();
    this.activeGarmentAccessory = accessory;
    this.garmentAccessoryContextMenu?.show(event);
  }

  protected openFabricContextMenu(event: MouseEvent, fabric: FabricRow): void {
    event.preventDefault();
    this.activeFabric = fabric;
    this.fabricContextMenu?.show(event);
  }
}
