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
import { MaskitoDirective } from '@maskito/angular';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MASKITO_DEFAULT_OPTIONS, maskitoTransform } from '@maskito/core';
import { maskitoPhoneOptionsGenerator } from '@maskito/phone';
import { isValidPhoneNumber, type CountryCode } from 'libphonenumber-js';
import phoneMetadata from 'libphonenumber-js/min/metadata';

import { WattIcon, WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattFieldComponent, WattFieldErrorComponent } from '@energinet-datahub/watt/field';

import { WattPhoneFieldIntlService } from './watt-phone-field-intl.service';

type Contry = {
  countryIsoCode: CountryCode;
  icon: WattIcon;
  phoneExtension: string;
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
        [hideSingleSelectionIndicator]="true"
        [value]="chosenCountry().countryIsoCode"
        (selectionChange)="selectedContry($event)"
      >
        <mat-select-trigger>
          <watt-icon [name]="chosenCountry().icon" />
        </mat-select-trigger>
        @for (contry of countries; track contry; let index = $index) {
          <mat-option value="{{ contry.countryIsoCode }}">
            <watt-icon [name]="contry.icon" />
            <div>{{ getCountryName(contry.countryIsoCode) }}</div>
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
  styleUrl: './watt-phone-field.component.scss',
})
export class WattPhoneFieldComponent implements ControlValueAccessor, OnInit {
  /** @ignore */
  readonly countries = [
    { countryIsoCode: 'DK', icon: 'custom-flag-da', phoneExtension: '+45' },
    { countryIsoCode: 'SE', icon: 'custom-flag-se', phoneExtension: '+46' },
    { countryIsoCode: 'NO', icon: 'custom-flag-no', phoneExtension: '+47' },
    { countryIsoCode: 'DE', icon: 'custom-flag-de', phoneExtension: '+49' },
    { countryIsoCode: 'FI', icon: 'custom-flag-fi', phoneExtension: '+358' },
    { countryIsoCode: 'PL', icon: 'custom-flag-pl', phoneExtension: '+48' },
  ] as Contry[];

  formControl = input.required<FormControl>();
  label = input<string>();

  /** @ignore */
  chosenCountry = signal<Contry>(this.countries[0]);

  /** @ignore */
  mask = MASKITO_DEFAULT_OPTIONS;

  /** @ignore */
  intl = inject(WattPhoneFieldIntlService);

  /** @ignore */
  @HostBinding('attr.watt-field-disabled')
  isDisabled = false;

  /** @ignore */
  value: string | null = null;

  /** @ignore */
  @ViewChild('phoneNumberInput') phoneNumberInput!: ElementRef<HTMLInputElement>;

  /** @ignore */
  ngOnInit(): void {
    this.setup();
  }

  /** @ignore */
  writeValue(value: string): void {
    if (value) {
      const country = this.countries.find((x) => value.startsWith(x.phoneExtension));
      if (country) {
        this.setCountry(country);
        value = maskitoTransform(value, this.mask);
      }
    }
    this.value = value;
  }

  /** @ignore */
  onChange: (value: string) => void = () => {
    /* noop function */
  };

  /** @ignore */
  onTouched: () => void = () => {
    /* noop function */
  };

  /** @ignore */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /** @ignore */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /** @ignore */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  /** @ignore */
  selectedContry(event: MatSelectChange) {
    const country = this.countries.find((contry) => contry.countryIsoCode === event.value);
    if (!country) throw new Error('Prefix not found');

    this.setCountry(country);
    this.formControl().reset();

    setTimeout(() => {
      this.phoneNumberInput.nativeElement.focus();
    }, 100);
  }

  /** @ignore */
  setCountry(country: Contry) {
    this.chosenCountry.set(country);
    this.setup();
  }

  /** @ignore */
  onChanged(event: Event): void {
    const value = (event.target as HTMLSelectElement)?.value;
    this.onChange(value);
  }

  /** @ignore */
  private generatePhoneOptions(): void {
    const phoneOptions = maskitoPhoneOptionsGenerator({
      countryIsoCode: this.chosenCountry().countryIsoCode,
      metadata: phoneMetadata,
      separator: ' ',
    });

    this.mask = phoneOptions;
  }

  /** @ignore */
  private setup(): void {
    this.generatePhoneOptions();
    this.setValidator();
  }

  /** @ignore */
  private setValidator() {
    const countryCode = this.chosenCountry().countryIsoCode;
    this.formControl().addValidators(phoneValidator(countryCode));
  }

  /** @ignore */
  getCountryName(countryIsoCode: CountryCode) {
    return this.intl[countryIsoCode as keyof WattPhoneFieldIntlService];
  }
}
