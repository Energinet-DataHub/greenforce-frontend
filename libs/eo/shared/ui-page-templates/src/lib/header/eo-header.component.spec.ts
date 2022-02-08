import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EoHeaderComponent } from './eo-header.component';

describe('EoHeaderComponent', () => {
  let component: EoHeaderComponent;
  let fixture: ComponentFixture<EoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EoHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
