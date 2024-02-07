import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DhProfileModalComponent } from './dh-profile-modal.component';

describe('DhProfileFeatureProfileModalComponent', () => {
  let component: DhProfileModalComponent;
  let fixture: ComponentFixture<DhProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DhProfileModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DhProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
