import { Route } from '@angular/router';

export const referencesRoutes: Route[] = [
  {
    path: 'references/additional-reference',
    loadComponent: () =>
      import('./pages/additional-reference/additional-reference').then(
        (p) => p.AdditionalReference,
      ),
  },
  {
    path: 'references/garment-accessory',
    loadComponent: () =>
      import('./pages/garment-accessory/garment-accessory').then((p) => p.GarmentAccessory),
  },
  {
    path: 'references/garment-part-operation',
    loadComponent: () =>
      import('./pages/garment-part-operation/garment-part-operation').then(
        (p) => p.GarmentPartOperation,
      ),
  },
  {
    path: 'references/supplier',
    loadComponent: () => import('./pages/supplier/supplier').then((p) => p.Supplier),
  },
];
