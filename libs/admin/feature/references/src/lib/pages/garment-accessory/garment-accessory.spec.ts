import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarmentAccessory } from './garment-accessory';

describe('GarmentAccessory', () => {
  let component: GarmentAccessory;
  let fixture: ComponentFixture<GarmentAccessory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GarmentAccessory],
    }).compileComponents();

    fixture = TestBed.createComponent(GarmentAccessory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
