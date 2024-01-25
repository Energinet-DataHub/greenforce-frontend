import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WattPhoneFieldComponent } from './';

describe(WattPhoneFieldComponent, () => {
  let component: WattPhoneFieldComponent;
  let fixture: ComponentFixture<WattPhoneFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WattPhoneFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WattPhoneFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
