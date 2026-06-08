import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fabric } from './fabric';

describe('Fabric', () => {
  let component: Fabric;
  let fixture: ComponentFixture<Fabric>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fabric],
    }).compileComponents();

    fixture = TestBed.createComponent(Fabric);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
