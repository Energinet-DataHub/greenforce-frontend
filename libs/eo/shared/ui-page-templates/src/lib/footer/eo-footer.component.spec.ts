import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EoFooterComponent } from './eo-footer.component';

describe('EoFooterComponent', () => {
  let component: EoFooterComponent;
  let fixture: ComponentFixture<EoFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EoFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EoFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
