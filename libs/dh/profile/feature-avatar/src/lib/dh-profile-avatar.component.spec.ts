import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DhProfileAvatarComponent } from './dh-profile-avatar.component';

describe('DhProfileAvatarComponent', () => {
  let component: DhProfileAvatarComponent;
  let fixture: ComponentFixture<DhProfileAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DhProfileAvatarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DhProfileAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
