import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WattPhoneFieldComponent } from './';
import { FormControl } from '@angular/forms';
import { input } from '@angular/core';

describe(WattPhoneFieldComponent, () => {
  let component: WattPhoneFieldComponent;
  let fixture: ComponentFixture<WattPhoneFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WattPhoneFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WattPhoneFieldComponent);
    component = fixture.componentInstance;
    component.formControl = input(new FormControl());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
