import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhChargePriceMessageComponent } from './dh-charge-price-message.component';

describe('DhChargePriceMessageComponent', () => {
  let component: DhChargePriceMessageComponent;
  let fixture: ComponentFixture<DhChargePriceMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DhChargePriceMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DhChargePriceMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
