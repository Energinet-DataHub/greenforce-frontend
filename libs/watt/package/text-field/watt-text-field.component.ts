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
import {
  Component,
  ViewEncapsulation,
  ElementRef,
  forwardRef,
  AfterViewInit,
  inject,
  input,
  output,
  signal,
  effect,
  viewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';

import { WattFieldComponent } from '@energinet/watt/field';
import { WattIconComponent, WattIcon } from '@energinet/watt/icon';

export type WattInputTypes = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';

@Component({
  imports: [MatAutocompleteModule, ReactiveFormsModule, WattFieldComponent, WattIconComponent],
  selector: 'watt-text-field',
  styleUrls: ['./watt-text-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.watt-field-disabled]': 'isDisabled',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattTextFieldComponent),
      multi: true,
    },
  ],
  template: `<watt-field
    #wattField
    [control]="formControl()"
    [label]="label()"
    [tooltip]="tooltip()"
    matAutocompleteOrigin
  >
    @if (prefix()) {
      <watt-icon [name]="prefix()" />
    }

    @if (!autocompleteOptions()) {
      <input
        [attr.aria-label]="label()"
        [attr.type]="type()"
        [attr.placeholder]="placeholder()"
        [value]="model"
        [formControl]="formControl()"
        (blur)="onTouched()"
        (input)="onChanged($event)"
        [maxlength]="maxLength()"
        #inputField
      />
    } @else {
      <input
        [attr.aria-label]="label()"
        [attr.type]="type()"
        [attr.placeholder]="placeholder()"
        [value]="model"
        [formControl]="formControl()"
        (blur)="onTouched()"
        (input)="onChanged($event)"
        [maxlength]="maxLength()"
        [matAutocomplete]="auto"
        [matAutocompleteConnectedTo]="{ elementRef: wattField.wrapper() ?? wattField.elementRef }"
        #inputField
      />

      <mat-autocomplete
        #auto="matAutocomplete"
        class="watt-autocomplete-panel"
        (optionSelected)="autocompleteOptionSelected.emit($event.option.value)"
      >
        @for (option of autocompleteOptions() || []; track option) {
          <mat-option [value]="option">
            {{ option }}
          </mat-option>
        }
      </mat-autocomplete>
    }

    <ng-content />
    <ng-content ngProjectAs="watt-field-descriptor" select=".descriptor" />
    <ng-content ngProjectAs="watt-field-hint" select="watt-field-hint" />
    <ng-content ngProjectAs="watt-field-error" select="watt-field-error" />
  </watt-field>`,
})
export class WattTextFieldComponent implements ControlValueAccessor, AfterViewInit {
  value = input<string>('');
  type = input<WattInputTypes>('text');
  placeholder = input<string | undefined>(undefined);
  label = input<string>('');
  tooltip = input<string | undefined>(undefined);
  prefix = input<WattIcon | undefined>(undefined);
  maxLength = input<string | number | null>(null);
  formControl = input.required<FormControl>();
  autocompleteOptions = input<string[] | undefined>(undefined);
  autocompleteMatcherFn = input<((value: string, option: string) => boolean) | undefined>(
    undefined
  );

  /** @ignore */
  autocompleteRef = viewChild(MatAutocomplete);

  /**
   * Emits the value of the input field when it changes.
   */
  searchChanged = output<string>();

  /**
   * Emits the value of the input field when an autocomplete option is selected.
   */
  autocompleteOptionSelected = output<string>();

  /**
   * Emits the value of the input field when an autocomplete option is selected.
   */
  autocompleteOptionDeselected = output<void>();

  /** @ignore */
  private element = inject(ElementRef);

  /** @ignore */
  inputField = viewChild<ElementRef<HTMLInputElement>>('inputField');
  private modelSignal = signal<string>('');

  /** Gets the current model value */
  get model(): string {
    return this.modelSignal();
  }

  constructor() {
    // Sync input value with model
    effect(() => {
      const inputValue = this.value();
      if (inputValue !== undefined) {
        this.modelSignal.set(inputValue);
      }
    });
  }

  /** @ignore */
  private isDisabledSignal = signal<boolean>(false);

  /** @ignore */
  get isDisabled(): boolean {
    return this.isDisabledSignal();
  }

  /** @ignore */
  onTouchedCallbacks: (() => void)[] = [];

  /** @ignore */
  ngAfterViewInit(): void {
    const attrName = 'data-testid';
    const testIdAttribute = this.element.nativeElement.getAttribute(attrName);
    this.element.nativeElement.removeAttribute(attrName);

    const inputField = this.inputField();
    if (inputField) {
      inputField.nativeElement.setAttribute(attrName, testIdAttribute);
      this.registerOnTouched(() => {
        const trimmedValue = inputField.nativeElement.value.trim();
        inputField.nativeElement.value = trimmedValue;
        this.formControl().setValue(trimmedValue);
      });
    }
  }

  /** @ignore */
  onChanged(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    const autocomplete = this.autocompleteRef();
    if (autocomplete) {
      // Reset the autocomplete selection if the value is not matching anymore, and auto-select if the value has a match
      autocomplete.options.forEach((option) => {
        const matcherFn = this.autocompleteMatcherFn();
        const isMatchingOption = matcherFn
          ? matcherFn(value, option.value)
          : option.value === value;

        if (isMatchingOption) {
          option.select(false);
          this.autocompleteOptionSelected.emit(option.value);
        } else {
          option.deselect(false);
          this.autocompleteOptionDeselected.emit();
        }
      });
    }

    this.searchChanged.emit(value);
    this.onChange(value);
  }

  /** @ignore */
  onChange: (value: string) => void = () => {
    /* noop function */
  };

  /** @ignore */
  onTouched: () => void = () => {
    for (const callback of this.onTouchedCallbacks) {
      callback();
    }
  };

  /** @ignore */
  writeValue(value: string): void {
    this.modelSignal.set(value);
  }

  /** @ignore */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /** @ignore */
  registerOnTouched(fn: () => void): void {
    this.onTouchedCallbacks.push(fn);
  }

  /** @ignore */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabledSignal.set(isDisabled);
  }

  /** @ignore */
  setFocus(): void {
    const inputField = this.inputField();
    if (inputField) {
      inputField.nativeElement.focus();
    }
  }
}
