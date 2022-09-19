import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhChargesPricesComponent } from './dh-charges-prices.component';

describe('DhChargesPricesComponent', () => {
  let component: DhChargesPricesComponent;
  let fixture: ComponentFixture<DhChargesPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DhChargesPricesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DhChargesPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
