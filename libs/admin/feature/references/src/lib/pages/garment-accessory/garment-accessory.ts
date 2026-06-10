import { Component, inject } from '@angular/core';

import { GarmentAccessoryPageStore } from './garment-accessory-page.store';

@Component({
  selector: 'lib-garment-accessory',
  imports: [],
  templateUrl: './garment-accessory.html',
  styleUrl: './garment-accessory.css',
  providers: [GarmentAccessoryPageStore],
})
export class GarmentAccessory {
  protected readonly store = inject(GarmentAccessoryPageStore);
}
