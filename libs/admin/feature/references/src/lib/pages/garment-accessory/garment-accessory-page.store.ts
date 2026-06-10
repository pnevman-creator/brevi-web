import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { FabricsApi } from '../../data-access/fabrics/fabrics.api';
import { GarmentAccessoriesApi } from '../../data-access/garment-accessories/garment-accessories.api';

import type {
  CreateFabricRequest,
  FabricRow,
  UpdateFabricRequest,
} from '../../data-access/fabrics/fabrics.models';
import type {
  CreateGarmentAccessoryRequest,
  GarmentAccessoryRow,
  UpdateGarmentAccessoryRequest,
} from '../../data-access/garment-accessories/garment-accessories.models';

@Injectable()
export class GarmentAccessoryPageStore {
  private readonly fabricsApi = inject(FabricsApi);
  private readonly garmentAccessoriesApi = inject(GarmentAccessoriesApi);

  readonly fabrics = httpResource<FabricRow[]>(() => '/api/reference/fabrics', {
    defaultValue: [],
  });

  readonly garmentAccessories = httpResource<GarmentAccessoryRow[]>(
    () => '/api/reference/garment-accessories',
    {
      defaultValue: [],
    },
  );

  createFabric(request: CreateFabricRequest): Observable<number> {
    return this.fabricsApi.create(request).pipe(tap(() => this.fabrics.reload()));
  }

  updateFabric(id: number, request: UpdateFabricRequest): Observable<void> {
    return this.fabricsApi.update(id, request).pipe(tap(() => this.fabrics.reload()));
  }

  deleteFabric(id: number): Observable<void> {
    return this.fabricsApi.delete(id).pipe(tap(() => this.fabrics.reload()));
  }

  createGarmentAccessory(request: CreateGarmentAccessoryRequest): Observable<number> {
    return this.garmentAccessoriesApi
      .create(request)
      .pipe(tap(() => this.garmentAccessories.reload()));
  }

  updateGarmentAccessory(id: number, request: UpdateGarmentAccessoryRequest): Observable<void> {
    return this.garmentAccessoriesApi
      .update(id, request)
      .pipe(tap(() => this.garmentAccessories.reload()));
  }

  deleteGarmentAccessory(id: number): Observable<void> {
    return this.garmentAccessoriesApi.delete(id).pipe(tap(() => this.garmentAccessories.reload()));
  }
}
