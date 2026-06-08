import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarmentPartOperation } from './garment-part-operation';

describe('GarmentPartOperation', () => {
  let component: GarmentPartOperation;
  let fixture: ComponentFixture<GarmentPartOperation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GarmentPartOperation],
    }).compileComponents();

    fixture = TestBed.createComponent(GarmentPartOperation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
