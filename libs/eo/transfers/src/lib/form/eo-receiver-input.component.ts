//#region License
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
//#endregion
import { Component, effect, forwardRef, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { translations } from '@energinet-datahub/eo/translations';
import { TranslocoPipe } from '@ngneat/transloco';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
} from '@angular/forms';
import { FormMode } from './eo-transfers-form.component';

@Component({
  selector: 'eo-receiver-input',
  imports: [
    CommonModule,
    TranslocoPipe,
    WattFieldErrorComponent,
    WattFieldHintComponent,
    WattTextFieldComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EoReceiverInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: EoReceiverInputComponent,
    },
  ],
  styles: [``],
  template: `
    <div style="display: flex; align-items: center;">
      <watt-text-field
        #receiverInput
        type="text"
        data-testid="new-agreement-receiver-input"
        (keydown)="preventNonNumericInput($event)"
        (search)="searchChange.emit($event)"
        (autocompleteOptionSelected)="onSelectedReceiver($event)"
        (autocompleteOptionDeselected)="selectedCompanyNameChange.emit(undefined)"
        [autocompleteOptions]="filteredReceiverTins() || []"
        [autocompleteMatcherFn]="isReceiverMatchingOption"
        [maxLength]="8"
        [formControl]="control"
        [label]="translations.createTransferAgreementProposal.parties.receiverTinLabel | transloco"
        [placeholder]="
          translations.createTransferAgreementProposal.parties.receiverTinPlaceholder | transloco
        "
      >
        @if (!control.errors && mode() === 'create') {
          <watt-field-hint
            [innerHTML]="
              translations.createTransferAgreementProposal.parties.receiverTinGeneralError
                | transloco
            "
          />
        }
        @if (control.errors?.pattern) {
          <watt-field-error
            [innerHTML]="
              translations.createTransferAgreementProposal.parties.tinFormatError | transloco
            "
          />
        }

        @if (selectedCompanyName() && control.value) {
          <div class="descriptor">{{ selectedCompanyName() }}</div>
        }
      </watt-text-field>
    </div>
  `,
})
export class EoReceiverInputComponent implements ControlValueAccessor, Validator {
  protected readonly translations = translations;

  control = new FormControl();
  mode = input.required<FormMode>();
  filteredReceiverTins = input.required<string[]>();
  selectedCompanyName = input<string | undefined>();
  senderTin = input<string | undefined>();

  selectedCompanyNameChange = output<string | undefined>();
  searchChange = output<string>();
  tinChange = output<string>();

  protected preventNonNumericInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Control', 'Alt'];
    const selectAll = event.key === 'a' && (event.metaKey || event.ctrlKey);
    const isNumericInput = /^[0-9]+$/.test(event.key);
    const isSpecialKey = allowedKeys.includes(event.key);

    if (!isNumericInput && !isSpecialKey && !selectAll) {
      event.preventDefault();
    }
  }

  onSelectedReceiver(value: string) {
    const [tin, companyName] = value.split(' - ');
    this.selectedCompanyNameChange.emit(companyName);
    this.tinChange.emit(tin);
  }

  isReceiverMatchingOption(value: string, option: string) {
    return value === option.split(' - ')[0];
  }

  validate(control: AbstractControl) {
    const value = control.value;
    const regExp = new RegExp('^([0-9]{8})?$');
    const isValid = regExp.test(value);
    if (isValid) {
      this.control.setErrors(null);
    } else {
      this.control.setErrors({ pattern: true });
    }
    return this.control.errors;
  }

  writeValue(value: never): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: never): void {
    this.onChange = fn;
    this.control.valueChanges.subscribe((val) => this.onChange(val));
  }

  registerOnTouched(fn: never): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTouched: any = () => {
    // Intentionally left empty
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: any = () => {
    // Intentionally left empty
  };
}
