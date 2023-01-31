/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable @angular-eslint/no-host-metadata-property */
import { Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import {
  Directive,
  ElementRef,
  Inject,
  NgZone,
  Optional,
  Self,
} from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatLegacyFormFieldControl as MatFormFieldControl } from '@angular/material/legacy-form-field';
import { MatLegacyInput as MatInput, MAT_LEGACY_INPUT_VALUE_ACCESSOR as MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/legacy-input';

@Directive({
  selector: '[wattInput]',
  exportAs: 'wattInput',
  host: {
    class: 'mat-input-element',
    '[class.mat-input-server]': '_isServer',
    // Native input properties that are overwritten by Angular inputs need to be synced with
    // the native input element. Otherwise property bindings for those don't work.
    '[attr.id]': 'id',
    // At the time of writing, we have a lot of customer tests that look up the input based on its
    // placeholder. Since we sometimes omit the placeholder attribute from the DOM to prevent screen
    // readers from reading it twice, we have to keep it somewhere in the DOM for the lookup.
    '[attr.data-placeholder]': 'placeholder',
    '[disabled]': 'disabled',
    '[required]': 'required',
    '[attr.readonly]': 'readonly && !_isNativeSelect || null',
    // Only mark the input as invalid for assistive technology if it has a value since the
    // state usually overlaps with `aria-required` when the input is empty and can be redundant.
    '[attr.aria-invalid]': '(empty && required) ? null : errorState',
    '[attr.aria-required]': 'required',
  },
  providers: [{ provide: MatFormFieldControl, useExisting: MatInput }],
})
export class WattInputDirective extends MatInput {
  constructor(
    protected _elementRef: ElementRef<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    protected _platform: Platform,
    @Optional() @Self() ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional()
    @Self()
    @Inject(MAT_INPUT_VALUE_ACCESSOR)
    inputValueAccessor: unknown,
    _autofillMonitor: AutofillMonitor,
    ngZone: NgZone
  ) {
    super(
      _elementRef,
      _platform,
      ngControl,
      _parentForm,
      _parentFormGroup,
      _defaultErrorStateMatcher,
      inputValueAccessor,
      _autofillMonitor,
      ngZone
    );
  }
}
