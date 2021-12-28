import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhChargeItemComponent } from './dh-charge-item.component';

describe('DhChargeItemComponent', () => {
  let component: DhChargeItemComponent;
  let fixture: ComponentFixture<DhChargeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DhChargeItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DhChargeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
