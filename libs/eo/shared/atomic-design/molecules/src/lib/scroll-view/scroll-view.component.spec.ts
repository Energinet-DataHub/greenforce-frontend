import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EoScrollViewComponent} from './scroll-view.component';

describe(EoScrollViewComponent.name, () => {
  let component: EoScrollViewComponent;
  let fixture: ComponentFixture<EoScrollViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EoScrollViewComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EoScrollViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
