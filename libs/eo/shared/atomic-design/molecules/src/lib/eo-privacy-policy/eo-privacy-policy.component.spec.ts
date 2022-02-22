import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EoPrivacyPolicyComponent } from './eo-privacy-policy.component';

describe(EoPrivacyPolicyComponent.name, () => {
  let component: EoPrivacyPolicyComponent;
  let fixture: ComponentFixture<EoPrivacyPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EoPrivacyPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EoPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
