import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhChargesPricesHistoryTabComponent } from './dh-charges-prices-history-tab.component';

describe('DhChargesPricesHistoryTabComponent', () => {
  let component: DhChargesPricesHistoryTabComponent;
  let fixture: ComponentFixture<DhChargesPricesHistoryTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DhChargesPricesHistoryTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DhChargesPricesHistoryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
