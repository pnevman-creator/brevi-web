import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalReference } from './additional-reference';

describe('AdditionalReference', () => {
  let component: AdditionalReference;
  let fixture: ComponentFixture<AdditionalReference>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalReference],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalReference);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
