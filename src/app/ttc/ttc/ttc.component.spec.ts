import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TtcComponent } from './ttc.component';

describe('TtcComponent', () => {
  let component: TtcComponent;
  let fixture: ComponentFixture<TtcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TtcComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with price 0, quantity 1 and vat 18', () => {
    expect(component.prixHt()).toBe(0);
    expect(component.quantite()).toBe(1);
    expect(component.tva()).toBe(18);
  });

  it('should compute the unit and total ttc prices', () => {
    component.prixHt.set(100);
    component.quantite.set(3);

    expect(component.prixUnitaireTtc()).toBeCloseTo(118);
    expect(component.totalTtc()).toBeCloseTo(354);
  });

  it('should update the prices when the vat changes', () => {
    component.prixHt.set(100);
    component.tva.set(7);

    expect(component.prixUnitaireTtc()).toBeCloseTo(107);
    expect(component.totalTtc()).toBeCloseTo(107);
  });

  it('should not apply a discount under 10 pieces', () => {
    component.prixHt.set(100);
    component.quantite.set(9);

    expect(component.tauxRemise()).toBe(0);
    expect(component.totalTtc()).toBeCloseTo(1062);
  });

  it('should apply a 20% discount from 10 to 15 pieces', () => {
    component.prixHt.set(100);

    component.quantite.set(10);
    expect(component.tauxRemise()).toBe(20);
    expect(component.totalTtc()).toBeCloseTo(944);

    component.quantite.set(15);
    expect(component.tauxRemise()).toBe(20);
    expect(component.totalTtc()).toBeCloseTo(1416);
  });

  it('should apply a 30% discount above 15 pieces', () => {
    component.prixHt.set(100);
    component.quantite.set(16);

    expect(component.tauxRemise()).toBe(30);
    expect(component.montantRemise()).toBeCloseTo(566.4);
    expect(component.totalTtc()).toBeCloseTo(1321.6);
  });
});
