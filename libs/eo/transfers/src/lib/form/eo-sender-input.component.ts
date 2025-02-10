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
import { Component, effect, forwardRef, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { translations } from '@energinet-datahub/eo/translations';
import { TranslocoPipe } from '@ngneat/transloco';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validator,
} from '@angular/forms';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

export interface Sender {
  tin: string;
  name: string | undefined;
}

@Component({
  selector: 'eo-sender-input',
  imports: [CommonModule, TranslocoPipe, WattDropdownComponent, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EoSenderInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: EoSenderInputComponent,
    },
  ],
  styles: [``],
  template: ` <watt-dropdown
    [label]="translations.createTransferAgreementProposal.parties.senderTinLabel | transloco"
    [options]="senderOptions()"
    [formControl]="control"
    required="true"
  />`,
})
export class EoSenderInputComponent implements ControlValueAccessor, Validator {
  senders = input<Sender[]>([]);
  senderChange = output<string>();

  senderOptions = signal<WattDropdownOptions>([]);
  control = new FormControl();
  protected readonly translations = translations;

  constructor() {
    effect(
      () => {
        const senders = this.senders();
        this.senderOptions.set(
          senders.map((sender) => ({
            value: sender.tin,
            displayValue: `${sender.tin} - ${sender.name ?? this.translations.createTransferAgreementProposal.parties.unknownParty}`,
          }))
        );
      }
    );
    this.control.valueChanges.subscribe((sender: string) => {
      this.senderChange.emit(sender);
    });
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
