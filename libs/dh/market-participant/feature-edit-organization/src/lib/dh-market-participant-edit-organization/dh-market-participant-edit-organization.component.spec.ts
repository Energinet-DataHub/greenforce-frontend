import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhMarketParticipantEditOrganizationComponent } from './dh-market-participant-edit-organization.component';

describe('DhMarketParticipantEditOrganizationComponent', () => {
  let component: DhMarketParticipantEditOrganizationComponent;
  let fixture: ComponentFixture<DhMarketParticipantEditOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DhMarketParticipantEditOrganizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DhMarketParticipantEditOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
