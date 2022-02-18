import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollViewComponent } from './scroll-view.component';

describe('ScrollViewComponent', () => {
  let component: ScrollViewComponent;
  let fixture: ComponentFixture<ScrollViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrollViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
