import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EoPrivacyPolicyShellComponent } from './eo-privacy-policy-shell.component';

describe('EoPrivacyPageShellComponent', () => {
  let component: EoPrivacyPolicyShellComponent;
  let fixture: ComponentFixture<EoPrivacyPolicyShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EoPrivacyPolicyShellComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EoPrivacyPolicyShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
