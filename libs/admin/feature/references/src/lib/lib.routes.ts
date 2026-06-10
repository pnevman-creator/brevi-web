import { Route } from '@angular/router';

export const referencesRoutes: Route[] = [
  {
    path: 'additional-reference',
    loadComponent: () =>
      import('./pages/additional-reference/additional-reference').then(
        (p) => p.AdditionalReference,
      ),
  },
  {
    path: 'garment-accessory',
    loadComponent: () =>
      import('./pages/garment-accessory/garment-accessory').then((p) => p.GarmentAccessory),
  },
  {
    path: 'garment-part',
    loadComponent: () => import('./pages/garment-part/garment-part').then((p) => p.GarmentPart),
  },
  {
    path: 'garment-part-operation',
    loadComponent: () =>
      import('./pages/garment-part-operation/garment-part-operation').then(
        (p) => p.GarmentPartOperation,
      ),
  },
  {
    path: 'supplier',
    loadComponent: () => import('./pages/supplier/supplier').then((p) => p.Supplier),
  },
];
