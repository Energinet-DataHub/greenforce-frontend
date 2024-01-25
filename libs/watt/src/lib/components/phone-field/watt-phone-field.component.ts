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
import {
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { WattIcon, WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattFieldComponent, WattFieldErrorComponent } from '@energinet-datahub/watt/field';

import { MaskitoDirective } from '@maskito/angular';
import { MASKITO_DEFAULT_OPTIONS } from '@maskito/core';
import { maskitoPhoneOptionsGenerator } from '@maskito/phone';
import { MetadataJson, isValidPhoneNumber, type CountryCode } from 'libphonenumber-js';

import { WattPhoneFieldIntlService } from './watt-phone-field-intl.service';

type PhonePrefix = {
  countryIsoCode: CountryCode;
  prefix: string;
  icon: WattIcon;
};

function phoneValidator(countryCode: CountryCode): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const valid = isValidPhoneNumber(control.value, countryCode);

    return valid ? null : { invalidPhone: true };
  };
}

@Component({
  selector: 'watt-phone-field',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    WattFieldComponent,
    WattIconComponent,
    MatSelectModule,
    ReactiveFormsModule,
    MaskitoDirective,
    WattFieldErrorComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattPhoneFieldComponent),
      multi: true,
    },
  ],
  template: `<watt-field [label]="label()" [control]="formControl()">
    <div class="watt-phone-field__prefix-container">
      <mat-select
        panelWidth=""
        panelClass="watt-phone-field__select"
        hideSingleSelectionIndicator="true"
        [value]="choosenPrefix().prefix"
        (selectionChange)="selectedPrefix($event)"
      >
        <mat-select-trigger>
          <watt-icon [name]="choosenPrefix().icon" />
        </mat-select-trigger>
        @for (phonePrefix of phonePrefixes; track phonePrefix; let index = $index) {
          <mat-option value="{{ phonePrefix.prefix }}">
            <watt-icon [name]="phonePrefix.icon" />
          </mat-option>
        }
      </mat-select>
      <input
        [attr.aria-label]="label()"
        autocomplete="tel"
        inputmode="tel"
        [value]="value"
        [formControl]="formControl()"
        (blur)="onTouched()"
        (input)="onChanged($event)"
        [maskito]="mask"
        #phoneNumberInput
      />
    </div>
    <ng-content ngProjectAs="watt-field-hint" select="watt-field-hint" />
    <ng-content ngProjectAs="watt-field-error" select="watt-field-error" />
    @if (formControl().hasError('invalidPhone')) {
      <watt-field-error> {{ intl.invalidPhoneNumber }} </watt-field-error>
    }
  </watt-field>`,
  styles: `
     .watt-phone-field__select {
        watt-icon {
          .mat-icon {
            margin-right:0;
          }
        }
     }
     watt-phone-field {
      display: block;

      .watt-phone-field__prefix-container {
        width:100%;
        display: flex;
        align-items: center;
        gap: var(--watt-space-xs);
      }

      input {
        width: 100%;
        border: none;
        &:focus-visible,
        &:focus-within {
          border: none;
          outline: none;
        }
      }

      .mat-mdc-select {
        width:auto;
        height:24px;

        .mat-mdc-select-arrow-wrapper {
          width: 24px;
          justify-content: center;
        }
      }
    }
  `,
})
export class WattPhoneFieldComponent implements ControlValueAccessor, OnInit {
  readonly phonePrefixes = [
    { countryIsoCode: 'DK', prefix: '+45', icon: 'custom-flag-da' },
    { countryIsoCode: 'SE', prefix: '+46', icon: 'custom-flag-se' },
    { countryIsoCode: 'NO', prefix: '+47', icon: 'custom-flag-no' },
    { countryIsoCode: 'DE', prefix: '+49', icon: 'custom-flag-de' },
  ] as PhonePrefix[];

  formControl = input.required<FormControl>();
  label = input<string>();

  choosenPrefix = signal<PhonePrefix>(this.phonePrefixes[0]);

  mask = MASKITO_DEFAULT_OPTIONS;
  intl = inject(WattPhoneFieldIntlService);

  @HostBinding('attr.watt-field-disabled')
  isDisabled = false;
  value: string | null = null;

  private _metadata: MetadataJson | null = null;
  @ViewChild('phoneNumberInput') phoneNumberInput!: ElementRef<HTMLInputElement>;

  async ngOnInit(): Promise<void> {
    this._metadata = await import('libphonenumber-js/min/metadata').then((m) => m.default);

    if (!this._metadata) return Promise.reject('Metadata not loaded');

    this.setup();
  }

  /* @ignore */
  writeValue(value: string): void {
    this.value = value;
  }

  /* @ignore */
  onChange: (value: string) => void = () => {
    /* noop function */
  };

  /* @ignore */
  onTouched: () => void = () => {
    /* noop function */
  };

  /* @ignore */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /* @ignore */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /* @ignore */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  /* @ignore */
  async selectedPrefix(event: MatSelectChange): Promise<void> {
    const choosenPrefix = this.phonePrefixes.find((prefix) => prefix.prefix === event.value);

    if (!choosenPrefix) return Promise.reject('Prefix not found');

    this.choosenPrefix.set(choosenPrefix);

    this.formControl().reset();
    this.setup();
  }

  /* @ignore */
  onChanged(event: Event): void {
    const value = (event.target as HTMLSelectElement)?.value;
    this.onChange(value);
  }

  private generatePhoneOptions(): void {
    const phoneOptions = maskitoPhoneOptionsGenerator({
      countryIsoCode: this.choosenPrefix().countryIsoCode,
      metadata: this._metadata!,
      separator: ' ',
    });

    this.mask = phoneOptions;
  }

  private setup(): void {
    this.generatePhoneOptions();
    this.setValidator();
    setTimeout(() => {
      this.phoneNumberInput.nativeElement.focus();
    }, 100);
  }

  private setValidator() {
    const countryCode = this.choosenPrefix().countryIsoCode;
    this.formControl().setValidators(phoneValidator(countryCode));
  }
}
