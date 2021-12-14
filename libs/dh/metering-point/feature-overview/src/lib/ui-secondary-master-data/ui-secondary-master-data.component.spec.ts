import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSecondaryMasterDataComponent } from './ui-secondary-master-data.component';

describe('UiSecondaryMasterDataComponent', () => {
  let component: UiSecondaryMasterDataComponent;
  let fixture: ComponentFixture<UiSecondaryMasterDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiSecondaryMasterDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSecondaryMasterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
