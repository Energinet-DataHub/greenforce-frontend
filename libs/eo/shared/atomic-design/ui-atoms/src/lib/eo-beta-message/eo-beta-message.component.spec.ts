import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EoBetaMessageComponent } from './eo-beta-message.component';

describe('EoBetaMessageComponent', () => {
  let component: EoBetaMessageComponent;
  let fixture: ComponentFixture<EoBetaMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EoBetaMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EoBetaMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
