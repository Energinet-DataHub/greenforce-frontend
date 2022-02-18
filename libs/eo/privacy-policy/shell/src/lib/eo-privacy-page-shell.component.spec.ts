import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EoPrivacyPageShellComponent } from './eo-privacy-page-shell.component';

describe('EoPrivacyPageShellComponent', () => {
  let component: EoPrivacyPageShellComponent;
  let fixture: ComponentFixture<EoPrivacyPageShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EoPrivacyPageShellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EoPrivacyPageShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
