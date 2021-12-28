import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhChargesComponent } from './dh-charges.component';

describe('DhChargesComponent', () => {
  let component: DhChargesComponent;
  let fixture: ComponentFixture<DhChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DhChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DhChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
