import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhChildMeteringPointComponent } from './dh-child-metering-point.component';

describe('DhChildMeteringPointComponent', () => {
  let component: DhChildMeteringPointComponent;
  let fixture: ComponentFixture<DhChildMeteringPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DhChildMeteringPointComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DhChildMeteringPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
