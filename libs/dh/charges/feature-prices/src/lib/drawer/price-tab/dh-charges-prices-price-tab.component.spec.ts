import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhChargesPricesPriceTabComponent } from './dh-charges-prices-price-tab.component';

describe('DhChargesPricesPricetabComponent', () => {
  let component: DhChargesPricesPriceTabComponent;
  let fixture: ComponentFixture<DhChargesPricesPriceTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DhChargesPricesPriceTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DhChargesPricesPriceTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
