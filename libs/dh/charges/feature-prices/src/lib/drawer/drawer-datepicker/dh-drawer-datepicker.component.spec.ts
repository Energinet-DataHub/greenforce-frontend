import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhDrawerDatepickerComponent } from './dh-drawer-datepicker.component';

describe('DrawerDatepickerComponent', () => {
  let component: DhDrawerDatepickerComponent;
  let fixture: ComponentFixture<DhDrawerDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DhDrawerDatepickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DhDrawerDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
