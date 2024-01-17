import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EovOverviewUiMasterdataDialogComponent } from './eov-overview-ui-masterdata-dialog.component';

describe('EovOverviewUiMasterdataDialogComponent', () => {
  let component: EovOverviewUiMasterdataDialogComponent;
  let fixture: ComponentFixture<EovOverviewUiMasterdataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EovOverviewUiMasterdataDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EovOverviewUiMasterdataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
