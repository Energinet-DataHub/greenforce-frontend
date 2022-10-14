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

  it.todo('initial date values should contain dates')
  it.todo('changes to date values should sync to subscribers')
  it.todo('changes to chip state should sync to subscribers')
  it.todo('should have 5 chips with values "d", "w", "m", "q", "y"')

});
