import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhChargeContentComponent } from './dh-charge-content.component';

describe('ChargeContentComponent', () => {
  let component: DhChargeContentComponent;
  let fixture: ComponentFixture<DhChargeContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DhChargeContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DhChargeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
