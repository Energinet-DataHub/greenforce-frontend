import {
  Component,
  AfterViewInit,
  ContentChild,
  ViewChild,
  Input,
  HostBinding,
} from '@angular/core';
import {
  MatFormField,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { WattInputDirective } from '../input/input.directive';

@Component({
  selector: 'watt-form-field',
  templateUrl: './form-field.component.html',
})
export class FormFieldComponent implements AfterViewInit {
  @Input() size: 'normal' | 'large' = 'normal';
  @HostBinding('class')
  get _cssClass() {
    return [`watt-form-field-${this.size}`];
  }

  beforeViewInit = true; // Used to remove placeholder control

  @ContentChild(WattInputDirective)
  control!: MatFormFieldControl<unknown>;

  @ViewChild(MatFormField)
  matFormField!: MatFormField;

  ngAfterViewInit() {
    if (this.beforeViewInit) {
      // Tick is needed to make this work, otherwise matFormField will be buggy
      setTimeout(() => {
        this.matFormField._control = this.control;
        this.matFormField.ngAfterContentInit();
        this.beforeViewInit = false;
      });
    }
  }
}
