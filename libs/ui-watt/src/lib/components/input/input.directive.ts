import { Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import {
  Directive,
  ElementRef,
  HostBinding,
  Inject,
  NgZone,
  Optional,
  Self,
} from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInput, MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';

@Directive({
  selector: '[wattInput]',
})
export class InputDirective {
  /*
  @HostBinding('attr.matInput') matInputDirective = new MatInput(
    this.elementRef,
    this.platform,
    this.ngControl,
    this._parentForm,
    this._parentFormGroup,
    this._defaultErrorStateMatcher,
    this.inputValueAccessor,
    this._autofillMonitor,
    this.ngZone
  );*/

  constructor(
    private elementRef: ElementRef,
    private platform: Platform,
    @Optional() @Self() private ngControl: NgControl,
    @Optional() private _parentForm: NgForm,
    @Optional() private _parentFormGroup: FormGroupDirective,
    private _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() @Self() @Inject(MAT_INPUT_VALUE_ACCESSOR) private inputValueAccessor: any,
    private _autofillMonitor: AutofillMonitor,
    private ngZone: NgZone
  ) {
    console.log('yes');
  }
}
