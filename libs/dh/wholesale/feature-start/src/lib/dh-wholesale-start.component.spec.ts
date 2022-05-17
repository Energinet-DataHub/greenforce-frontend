import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhWholesaleStartComponent } from './dh-wholesale-start.component';

describe('DhWholesaleStartComponent', () => {
  let component: DhWholesaleStartComponent;
  let fixture: ComponentFixture<DhWholesaleStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DhWholesaleStartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DhWholesaleStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
