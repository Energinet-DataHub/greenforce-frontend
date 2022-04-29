import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WattButtonAltComponent } from './watt-button-alt.component';

describe('WattButtonAltComponent', () => {
  let component: WattButtonAltComponent;
  let fixture: ComponentFixture<WattButtonAltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WattButtonAltComponent],
    });

    fixture = TestBed.createComponent(WattButtonAltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
