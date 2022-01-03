import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhChargesServerErrorComponent } from './dh-charges-server-error.component';

describe('DhChargesServerErrorComponent', () => {
  let component: DhChargesServerErrorComponent;
  let fixture: ComponentFixture<DhChargesServerErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DhChargesServerErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DhChargesServerErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
