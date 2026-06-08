import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarmentPart } from './garment-part';

describe('GarmentPart', () => {
  let component: GarmentPart;
  let fixture: ComponentFixture<GarmentPart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GarmentPart],
    }).compileComponents();

    fixture = TestBed.createComponent(GarmentPart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
