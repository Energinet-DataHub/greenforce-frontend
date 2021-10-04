import { Component, AfterViewInit, ContentChild, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { WattInputDirective } from '../input/input.directive';

@Component({
  selector: 'watt-form-field',
  templateUrl: './form-field.component.html'
})
export class FormFieldComponent implements AfterViewInit {
  beforeViewInit = true;  // Used to remove placeholder control
  
  @ContentChild(WattInputDirective)
  control!: MatFormFieldControl<unknown>;

  @ViewChild(MatFormField)
  matFormField!: MatFormField;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (this.beforeViewInit) {
      setTimeout(() => {
        this.matFormField._control = this.control;
        this.matFormField.ngAfterContentInit();
        this.beforeViewInit = false;
      });
    }
  }
}
