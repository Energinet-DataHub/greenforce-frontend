import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhChargesPricesDrawerComponent } from './dh-charges-prices-drawer.component';

describe('DhChargesPricesDrawerComponent', () => {
  let component: DhChargesPricesDrawerComponent;
  let fixture: ComponentFixture<DhChargesPricesDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DhChargesPricesDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DhChargesPricesDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
