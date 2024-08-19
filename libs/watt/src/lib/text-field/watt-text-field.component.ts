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
  Input,
  ViewEncapsulation,
  HostBinding,
  ElementRef,
  ViewChild,
  forwardRef,
  AfterViewInit,
  inject,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';

import { WattFieldComponent } from '@energinet-datahub/watt/field';
import { WattIconComponent, WattIcon } from '@energinet-datahub/watt/icon';

export type WattInputTypes = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';

@Component({
  standalone: true,
  imports: [MatAutocompleteModule, ReactiveFormsModule, WattFieldComponent, WattIconComponent],
  selector: 'watt-text-field',
  styleUrls: ['./watt-text-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattTextFieldComponent),
      multi: true,
    },
  ],
  template: `<watt-field
    #wattField
    [control]="formControl"
    [label]="label"
    [tooltip]="tooltip"
    matAutocompleteOrigin
  >
    @if (prefix) {
      <watt-icon [name]="prefix" />
    }

    @if (!autocompleteOptions) {
      <input
        [attr.aria-label]="label"
        [attr.type]="type"
        [attr.placeholder]="placeholder"
        [value]="value"
        [formControl]="formControl"
        (blur)="onTouched()"
        (input)="onChanged($event)"
        [maxlength]="maxLength"
        #inputField
      />
    } @else {
      <input
        [attr.aria-label]="label"
        [attr.type]="type"
        [attr.placeholder]="placeholder"
        [value]="value"
        [formControl]="formControl"
        (blur)="onTouched()"
        (input)="onChanged($event)"
        [maxlength]="maxLength"
        [matAutocomplete]="auto"
        [matAutocompleteConnectedTo]="{ elementRef: wattField.wrapper() }"
        #inputField
      />

      <mat-autocomplete
        #auto="matAutocomplete"
        class="watt-autocomplete-panel"
        (optionSelected)="autocompleteOptionSelected.emit($event.option.value)"
      >
        @for (option of autocompleteOptions; track option) {
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
  @Input() value!: string;
  @Input() type: WattInputTypes = 'text';
  @Input() placeholder?: string;
  @Input() label = '';
  @Input() tooltip?: string;
  @Input() prefix?: WattIcon;
  @Input() maxLength: string | number | null = null;
  @Input() formControl!: FormControl;
  @Input() autocompleteOptions!: string[];
  @Input() autocompleteMatcherFn!: (value: string, option: string) => boolean;

  /** @ignore */
  @ViewChild(MatAutocomplete) autocompleteRef!: MatAutocomplete;

  /**
   * Emits the value of the input field when it changes.
   */
  @Output() search = new EventEmitter<string>();

  /**
   * Emits the value of the input field when an autocomplete option is selected.
   */
  @Output() autocompleteOptionSelected = new EventEmitter<string>();

  /**
   * Emits the value of the input field when an autocomplete option is selected.
   */
  @Output() autocompleteOptionDeselected = new EventEmitter<void>();

  /** @ignore */
  private element = inject(ElementRef);

  /** @ignore */
  @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;
  model!: string;

  /** @ignore */
  @HostBinding('attr.watt-field-disabled')
  isDisabled = false;

  /** @ignore */
  onTouchedCallbacks: (() => void)[] = [];

  /** @ignore */
  ngAfterViewInit(): void {
    const attrName = 'data-testid';
    const testIdAttribute = this.element.nativeElement.getAttribute(attrName);
    this.element.nativeElement.removeAttribute(attrName);
    this.inputField.nativeElement.setAttribute(attrName, testIdAttribute);
    this.registerOnTouched(() => {
      const trimmedValue = this.inputField.nativeElement.value.trim();
      this.inputField.nativeElement.value = trimmedValue;
      this.formControl.setValue(trimmedValue);
    });
  }

  /** @ignore */
  onChanged(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    if (this.autocompleteRef) {
      // Reset the autocomplete selection if the value is not matching anymore, and auto-select if the value has a match
      this.autocompleteRef.options.forEach((option) => {
        const isMatchingOption = this.autocompleteMatcherFn
          ? this.autocompleteMatcherFn(value, option.value)
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

    this.search.emit(value);
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
    this.model = value;
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
    this.isDisabled = isDisabled;
  }

  /** @ignore */
  setFocus(): void {
    this.inputField.nativeElement.focus();
  }
}
