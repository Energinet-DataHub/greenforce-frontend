import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EoMeteringPointsShellComponent } from './eo-metering-points-shell.component';

describe('EoMeteringPointsShellComponent', () => {
  let component: EoMeteringPointsShellComponent;
  let fixture: ComponentFixture<EoMeteringPointsShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EoMeteringPointsShellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EoMeteringPointsShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
