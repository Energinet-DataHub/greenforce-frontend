import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhChargesNotFoundComponent } from './dh-charges-not-found.component';

describe('DhChargesNotFoundComponent', () => {
  let component: DhChargesNotFoundComponent;
  let fixture: ComponentFixture<DhChargesNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DhChargesNotFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DhChargesNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
