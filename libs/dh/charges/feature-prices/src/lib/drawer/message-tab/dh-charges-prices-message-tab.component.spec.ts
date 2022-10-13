import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhChargesPricesMessageTabComponent } from './dh-charges-prices-message-tab.component';

describe('DhChargesMessageTabComponent', () => {
  let component: DhChargesPricesMessageTabComponent;
  let fixture: ComponentFixture<DhChargesPricesMessageTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DhChargesPricesMessageTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DhChargesPricesMessageTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
