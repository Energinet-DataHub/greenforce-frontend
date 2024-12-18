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
import { Component, forwardRef, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { translations } from '@energinet-datahub/eo/translations';
import { TranslocoPipe } from '@ngneat/transloco';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { FormMode } from './eo-transfers-form.component';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Component({
  selector: 'eo-receiver-input',
  standalone: true,
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
    <div class="receiver">
      @if (mode() === 'create') {
        <h3 class="watt-headline-2">
          {{ translations.createTransferAgreementProposal.parties.titleBetween | transloco }}
        </h3>
        <h3 class="watt-headline-2">
          {{ translations.createTransferAgreementProposal.parties.titleTo | transloco }}
        </h3>
        <p>
          {{ translations.createTransferAgreementProposal.parties.description | transloco }}
        </p>
      }

      <div style="display: flex; align-items: center;">
        <watt-text-field
          [label]="
            translations.createTransferAgreementProposal.parties.receiverTinLabel | transloco
          "
          [placeholder]="
            translations.createTransferAgreementProposal.parties.receiverTinPlaceholder | transloco
          "
          type="text"
          (keydown)="preventNonNumericInput($event)"
          data-testid="new-agreement-receiver-input"
          [autocompleteOptions]="filteredReceiversTin() || []"
          (search)="searchChange.emit($event)"
          (autocompleteOptionSelected)="onSelectedRecipient($event)"
          (autocompleteOptionDeselected)="selectedCompanyNameChange.emit(undefined)"
          [autocompleteMatcherFn]="isRecipientMatchingOption"
          [maxLength]="8"
          #recipientInput
        >
          @if (!formErrors() && mode() === 'create') {
            <watt-field-hint
              [innerHTML]="
                translations.createTransferAgreementProposal.parties.receiverTinGeneralError
                  | transloco
              "
            />
          }

          @if (formErrors()?.['receiverTinEqualsSenderTin']) {
            <watt-field-error
              [innerHTML]="
                translations.createTransferAgreementProposal.parties.receiverTinEqualsSenderTin
                  | transloco
              "
            />
          }

          @if (formErrors()?.['pattern']) {
            <watt-field-error
              [innerHTML]="
                translations.createTransferAgreementProposal.parties.tinFormatError | transloco
              "
            />
          }

          @if (selectedCompanyName()) {
            <div class="descriptor">{{ selectedCompanyName() }}</div>
          }
        </watt-text-field>
      </div>
    </div>
  `,
})
export class EoReceiverInputComponent implements ControlValueAccessor, Validator {
  protected readonly translations = translations;
  control = new FormControl();
  isDisabled = false;

  mode = input.required<FormMode>();
  filteredReceiversTin = input.required<string[]>();
  selectedCompanyName = input<string | undefined>();
  formErrors = input<ValidationErrors | null>();

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

  onSelectedRecipient(value: string) {
    const [tin, companyName] = value.split(' - ');
    this.selectedCompanyNameChange.emit(companyName);
    this.tinChange.emit(tin);
  }

  isRecipientMatchingOption(value: string, option: string) {
    return value === option.split(' - ')[0];
  }

  validate(control: AbstractControl) {
    this.control.setErrors(control.errors);
    // We need to mark the control as touched to show the error
    this.control.markAsDirty();

    return control.errors;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTouched: any = () => {
    // Intentionally left empty
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: any = () => {
    // Intentionally left empty
  };
}
