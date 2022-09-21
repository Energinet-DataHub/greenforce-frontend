import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhChargesPricesResultComponent } from './dh-charges-prices-result.component';

describe('DhChargesPricesResultComponent', () => {
  let component: DhChargesPricesResultComponent;
  let fixture: ComponentFixture<DhChargesPricesResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DhChargesPricesResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DhChargesPricesResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
