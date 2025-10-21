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
  input,
  model,
  signal,
  effect,
  OnInit,
  inject,
  Component,
  viewChild,
  DestroyRef,
  ViewEncapsulation,
  computed,
} from '@angular/core';

import {
  NgControl,
  ValidatorFn,
  FormControl,
  ValidationErrors,
  AsyncValidatorFn,
  UntypedFormControl,
  ReactiveFormsModule,
  ControlValueAccessor,
} from '@angular/forms';

import { NgClass } from '@angular/common';

import { RxPush } from '@rx-angular/template/push';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { of, ReplaySubject, map, take, mergeWith } from 'rxjs';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule, MatSelect } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { WattIconComponent } from '@energinet/watt/icon';
import { WattFieldComponent } from '@energinet/watt/field';
import { WattMenuChipComponent } from '@energinet/watt/chip';

import type { WattDropdownValue } from './watt-dropdown-value';
import type {
  WattDropdownOptions,
  WattDropdownOptionGroup,
  WattDropdownGroupedOptions,
} from './watt-dropdown-option';

@Component({
  selector: 'watt-dropdown',
  templateUrl: './watt-dropdown.component.html',
  styleUrls: ['./watt-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    RxPush,
    NgClass,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,

    WattIconComponent,
    WattFieldComponent,
    WattMenuChipComponent,
  ],
  host: {
    '[attr.watt-field-disabled]': 'isDisabled()',
    '[class.watt-chip-mode]': 'chipMode()',
  },
})
export class WattDropdownComponent implements ControlValueAccessor, OnInit {
  private parentControlDirective = inject(NgControl, { host: true });
  private destroyRef = inject(DestroyRef);
  private validateParent?: ValidatorFn;
  private validateParentAsync?: AsyncValidatorFn;
  private _options: WattDropdownOptions = [];
  private _groupedOptions: WattDropdownGroupedOptions = [];
  parentControl: FormControl | null = null;
  matSelectControl = new FormControl<string | string[] | undefined | null>(null);

  /**
   * Control for the MatSelect filter keyword
   */
  filterControl = new UntypedFormControl();

  /**
   * List of options filtered by search keyword
   */
  filteredOptions$ = new ReplaySubject<WattDropdownOptions>(1);

  /**
   * List of grouped options filtered by search keyword
   */
  filteredGroupedOptions$ = new ReplaySubject<WattDropdownGroupedOptions>(1);

  mergedFilteredOptions$ = this.filteredOptions$.pipe(
    mergeWith(this.filteredGroupedOptions$),
    take(1),
    map((options) => {
      if (this.hasGroups()) {
        return (options as WattDropdownGroupedOptions)
          .flatMap((group) => ('options' in group ? group.options : []))
          .map((option) => option.value);
      }

      return (options as WattDropdownOptions).map((option) => option.value);
    })
  );

  emDash = '—';
  isToggleAllChecked = false;
  isToggleAllIndeterminate = false;
  isDisabled = signal(false);

  get showTriggerValue(): boolean {
    const multiple = this.multiple();
    return (multiple &&
      this.matSelectControl.value?.length === 1 &&
      this.matSelectControl.value[0] !== '') ||
      (!multiple && this.matSelect()?.triggerValue)
      ? true
      : false;
  }

  get showChipLabel() {
    return this.multiple() && this.matSelectControl.value && this.matSelectControl.value.length > 1
      ? true
      : false;
  }

  matSelect = viewChild<MatSelect>('matSelect');
  hideSearch = input(false);
  panelWidth = input<null | 'auto'>(null);
  getCustomTrigger = input<(value: string | string[]) => string>();

  /**
   * Set the mode of the dropdown.
   */
  chipMode = input(false);
  disableSelectedMode = input(false);
  sortDirection = input<'asc' | 'desc'>();

  /**
   * Sets the options for the dropdown.
   * Can be a flat array of options or an array containing both options and option groups.
   */
  options = model<WattDropdownOptions | WattDropdownGroupedOptions>([]);

  /**
   * Sets support for selecting multiple dropdown options.
   */
  multiple = input(false);

  /**
   * Sets support for hiding the reset option in "single" select mode.
   */
  showResetOption = input(true);

  /**
   * Sets the placeholder for the dropdown.
   */
  placeholder = input('');

  /**
   * Sets the label for the dropdown.
   */
  label = input('');

  /**
   * Label to be shown when no options are found after filtering.
   *
   * Note: The label is visible in "multiple" mode only.
   */
  noOptionsFoundLabel = input('');

  hasGroups = computed(() => {
    const options = this.options();
    return options.some(
      (option) => 'options' in option && Array.isArray((option as WattDropdownOptionGroup).options)
    );
  });

  constructor() {
    effect(() => {
      const options = this.options();
      if (Array.isArray(options)) {
        const optionsCopy = [...options];

        if (this.hasGroups()) {
          this.handleGroup(optionsCopy as WattDropdownGroupedOptions);
        } else {
          this.handleFlat(optionsCopy as WattDropdownOptions);
        }
      }
    });
    this.parentControlDirective.valueAccessor = this;
  }

  private handleFlat(optionsCopy: WattDropdownOptions) {
    if (this.sortDirection()) {
      optionsCopy = this.sortOptions(optionsCopy);
    }

    this._options = optionsCopy;
    this.filteredOptions$.next(this._options);
  }

  private handleGroup(optionsCopy: WattDropdownGroupedOptions) {
    this._groupedOptions = this.processGroupedOptions(optionsCopy);
    this.filteredGroupedOptions$.next(this._groupedOptions);
  }

  private processGroupedOptions(options: WattDropdownGroupedOptions): WattDropdownGroupedOptions {
    return options.map((group) => {
      if (this.sortDirection()) {
        group.options = this.sortOptions(group.options);
      }
      return group;
    });
  }

  ngOnInit() {
    this.listenForFilterFieldValueChanges();
    this.initializePropertiesFromParent();
    this.bindParentValidatorsToControl();
    this.bindControlToParent();
  }

  writeValue(value: WattDropdownValue) {
    this.matSelectControl.setValue(value);
  }

  registerOnChange(onChangeFn: (value: WattDropdownValue) => void) {
    this.changeParentValue = onChangeFn;
  }

  registerOnTouched(onTouchFn: () => void) {
    this.markParentControlAsTouched = onTouchFn;
  }

  setDisabledState(shouldDisable: boolean) {
    this.isDisabled.set(shouldDisable);
    if (shouldDisable) {
      this.matSelectControl.disable();
    } else {
      this.matSelectControl.enable();
    }
  }

  onToggleAll(toggleAllState: boolean) {
    this.mergedFilteredOptions$.subscribe((filteredOptions: string[]) => {
      const optionsToSelect = toggleAllState ? filteredOptions : [];
      this.matSelectControl.patchValue(optionsToSelect);
    });
  }

  public sortOptions(options: WattDropdownOptions): WattDropdownOptions {
    return [...options].sort((a, b) => {
      return this.sortDirection() === 'asc'
        ? a.displayValue.localeCompare(b.displayValue)
        : b.displayValue.localeCompare(a.displayValue);
    });
  }

  private listenForFilterFieldValueChanges() {
    this.filterControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.filterOptions();

      if (this.multiple()) {
        this.determineToggleAllCheckboxState();
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private changeParentValue = (value: WattDropdownValue) => {
    // Intentionally left empty
  };

  private markParentControlAsTouched = () => {
    // Intentionally left empty
  };

  /**
   * @ignore
   *
   * Store the parent control, its validators and async validators in properties
   * of this component.
   */
  private initializePropertiesFromParent() {
    this.parentControl = this.parentControlDirective.control as UntypedFormControl;

    this.validateParent =
      (this.parentControl.validator && this.parentControl.validator.bind(this.parentControl)) ||
      (() => null);

    this.validateParentAsync =
      (this.parentControl.asyncValidator &&
        this.parentControl.asyncValidator.bind(this.parentControl)) ||
      (() => of(null));
  }

  /**
   * @ignore
   *
   * Inherit validators from parent form control.
   */
  private bindParentValidatorsToControl() {
    const validators = !this.matSelectControl.validator
      ? [this.validateParent]
      : Array.isArray(this.matSelectControl.validator)
        ? [...this.matSelectControl.validator, this.validateParent]
        : [this.matSelectControl.validator, this.validateParent];
    this.matSelectControl.setValidators(validators);

    const asyncValidators = !this.matSelectControl.asyncValidator
      ? [this.validateParentAsync]
      : Array.isArray(this.matSelectControl.asyncValidator)
        ? [...this.matSelectControl.asyncValidator, this.validateParentAsync]
        : [this.matSelectControl.asyncValidator, this.validateParentAsync];
    this.matSelectControl.setAsyncValidators(asyncValidators);

    this.matSelectControl.updateValueAndValidity();
  }

  /**
   * @ignore
   *
   * Emit values to the parent form control when our form control's value
   * changes.
   *
   * Reflect parent validation errors in our form control.
   */
  private bindControlToParent() {
    this.handleValueChange();
    this.handleStatusChange();
  }

  private handleStatusChange() {
    this.parentControl?.statusChanges
      .pipe(
        map(
          () =>
            ({
              ...this.parentControl?.errors,
            }) as ValidationErrors
        ),
        map((errors) => (Object.keys(errors).length > 0 ? errors : null)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((errors) => {
        this.matSelectControl.setErrors(errors);
      });
  }

  private handleValueChange() {
    this.matSelectControl.valueChanges
      .pipe(
        map((value) => (value === undefined ? null : value)),
        map((value: WattDropdownValue) => {
          if (Array.isArray(value) && value.length === 0) {
            return null;
          }

          return value;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value: WattDropdownValue) => {
        if (this.multiple()) {
          this.determineToggleAllCheckboxState();
        }

        this.markParentControlAsTouched();
        this.changeParentValue(value);
      });
  }

  private filterOptions() {
    if (!this._options) {
      return;
    }

    const search = (this.filterControl.value as string).trim().toLowerCase();

    if (!search) {
      this.filteredOptions$.next(this._options.slice());

      if (this.hasGroups()) {
        this.filteredGroupedOptions$.next(this._groupedOptions.slice());
      }
      return;
    }

    const filteredFlatOptions = this._options.filter(
      (option) => option.displayValue.toLowerCase().indexOf(search) > -1
    );

    this.filteredOptions$.next(filteredFlatOptions);

    if (this.hasGroups()) {
      this.filterGroups(search);
    }
  }

  private filterGroups(search: string) {
    const filteredGroups = this._groupedOptions
      .map((item) => {
        if (!('options' in item)) {
          return null;
        }
        const filteredGroupOptions = item.options.filter(
          (option) => option.displayValue.toLowerCase().indexOf(search) > -1
        );

        return filteredGroupOptions.length > 0 ? { ...item, options: filteredGroupOptions } : null;
      })
      .filter(Boolean) as WattDropdownGroupedOptions;

    this.filteredGroupedOptions$.next(filteredGroups);
  }

  private determineToggleAllCheckboxState() {
    this.mergedFilteredOptions$.subscribe((filteredOptions: string[]) => {
      const selectedOptions = this.matSelectControl.value;

      if (Array.isArray(selectedOptions)) {
        const selectedFilteredOptions = filteredOptions.filter((option) =>
          selectedOptions.includes(option)
        );

        this.isToggleAllIndeterminate =
          selectedFilteredOptions.length > 0 &&
          selectedFilteredOptions.length < filteredOptions.length;

        this.isToggleAllChecked =
          selectedFilteredOptions.length > 0 &&
          selectedFilteredOptions.length === filteredOptions.length;
      }
    });
  }
}
