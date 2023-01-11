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
  Host,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AsyncValidatorFn,
  ControlValueAccessor,
  FormControl,
  NgControl,
  UntypedFormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import {
  of,
  ReplaySubject,
  Subject,
  distinctUntilChanged,
  map,
  takeUntil,
  take,
} from 'rxjs';

import { WattDropdownOptions } from './watt-dropdown-option';
import { WattDropdownValue } from './watt-dropdown-value';

const MAX_DISTANCE_FROM_SCREEN_LEFT_EDGE = 60;

@Component({
  selector: 'watt-dropdown',
  templateUrl: './watt-dropdown.component.html',
  styleUrls: ['./watt-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WattDropdownComponent
  implements ControlValueAccessor, OnInit, OnChanges, OnDestroy
{
  /**
   * @ignore
   */
  private destroy$ = new Subject<void>();
  /**
   * @ignore
   */
  private parentControl?: UntypedFormControl;
  /**
   * @ignore
   */
  private validateParent?: ValidatorFn;
  /**
   * @ignore
   */
  private validateParentAsync?: AsyncValidatorFn;

  /**
   * @ignore
   */
  matSelectControl = new FormControl<string | string[] | undefined | null>(
    null
  );

  /**
   * Control for the MatSelect filter keyword
   *
   * @ignore
   */
  filterControl = new UntypedFormControl();

  /**
   * List of options filtered by search keyword
   *
   * @ignore
   */
  filteredOptions$ = new ReplaySubject<WattDropdownOptions>(1);

  /**
   * @ignore
   */
  isCloseToScreenLeftEdge = false;

  /**
   * @ignore
   */
  emDash = '—';

  /**
   * @ignore
   */
  isToggleAllChecked = false;

  /**
   * @ignore
   */
  isToggleAllIndeterminate = false;

  /**
   * @ignore
   */
  @ViewChild('matSelect', { static: true }) matSelect?: MatSelect;

  /**
   * Wether the dropdown is disabled
   */
  @Input() disabled = false;

  /**
   *
   * Sets the options for the dropdown.
   */
  @Input() options: WattDropdownOptions = [];

  /**
   * Sets support for selecting multiple dropdown options.
   */
  @Input() multiple = false;

  /**
   * Sets support for hiding the reset option in "single" select mode.
   */
  @Input() showResetOption = true;

  /**
   * Sets the placeholder for the dropdown.
   */
  @Input() placeholder = '';

  /**
   * Label to be shown when no options are found after filtering.
   *
   * Note: The label is visible in "multiple" mode only.
   */
  @Input() noOptionsFoundLabel = '';

  constructor(@Host() private parentControlDirective: NgControl) {
    this.parentControlDirective.valueAccessor = this;
  }

  /**
   * @ignore
   */
  ngOnInit(): void {
    this.listenForFilterFieldValueChanges();
    this.initializePropertiesFromParent();
    this.bindParentValidatorsToControl();
    this.bindControlToParent();
  }

  /**
   * @ignore
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options?.currentValue !== changes.options?.previousValue) {
      this.filteredOptions$.next(this.options.slice());
    }
  }

  /**
   * @ignore
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * @ignore
   */
  writeValue(value: WattDropdownValue): void {
    this.matSelectControl.setValue(value);
  }

  /**
   * @ignore
   */
  registerOnChange(onChangeFn: (value: WattDropdownValue) => void): void {
    this.changeParentValue = onChangeFn;
  }

  /**
   * @ignore
   */
  registerOnTouched(onTouchFn: () => void) {
    this.markParentControlAsTouched = onTouchFn;
  }

  /**
   * @ignore
   */
  setDisabledState(shouldDisable: boolean): void {
    if (shouldDisable) {
      this.matSelectControl.disable();
    } else {
      this.matSelectControl.enable();
    }
  }

  /**
   * If the dropdown is in "multiple" mode and close to the screen's left edge,
   * Angular Material positions the dropdown panel slightly to the right
   * causing alignment issues to our custom positionning.
   *
   * This function tries to figure out whether the dropdown is positioned bellow
   * a specific threshold from the screen's left edge.
   *
   * @ignore
   */
  onMouseDown(): void {
    if (this.multiple) {
      const triggerPosition: DOMRect | undefined =
        this.matSelect?.trigger?.nativeElement?.getBoundingClientRect();

      if (triggerPosition == undefined) {
        this.isCloseToScreenLeftEdge = false;
        return;
      }

      this.isCloseToScreenLeftEdge =
        triggerPosition.left <= MAX_DISTANCE_FROM_SCREEN_LEFT_EDGE;
    }
  }

  /**
   * @ignore
   */
  onToggleAll(toggleAllState: boolean): void {
    this.filteredOptions$
      .pipe(
        take(1),
        map((options) => options.map((option) => option.value))
      )
      .subscribe((filteredOptions: string[]) => {
        const optionsToSelect = toggleAllState ? filteredOptions : [];

        this.matSelectControl.patchValue(optionsToSelect);
      });
  }

  /**
   * @ignore
   */
  private listenForFilterFieldValueChanges() {
    this.filterControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.filterOptions();

        if (this.multiple) {
          this.determineToggleAllCheckboxState();
        }
      });
  }

  /**
   * @ignore
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private changeParentValue = (value: WattDropdownValue): void => {
    // Intentionally left empty
  };

  /**
   * @ignore
   */
  private markParentControlAsTouched = (): void => {
    // Intentionally left empty
  };

  /**
   * @ignore
   *
   * Store the parent control, its validators and async validators in properties
   * of this component.
   */
  private initializePropertiesFromParent(): void {
    this.parentControl = this.parentControlDirective
      .control as UntypedFormControl;

    this.validateParent =
      (this.parentControl.validator &&
        this.parentControl.validator.bind(this.parentControl)) ||
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
  private bindParentValidatorsToControl(): void {
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
  private bindControlToParent(): void {
    this.matSelectControl.valueChanges
      .pipe(
        map((value) => (value === undefined ? null : value)),
        map((value: WattDropdownValue) => {
          if (Array.isArray(value) && value.length === 0) {
            return null;
          }

          return value;
        }),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value: WattDropdownValue) => {
        if (this.multiple) {
          this.determineToggleAllCheckboxState();
        }

        this.markParentControlAsTouched();
        this.changeParentValue(value);
      });

    this.parentControl?.statusChanges
      .pipe(
        map(
          () =>
            ({
              ...this.parentControl?.errors,
            } as ValidationErrors)
        ),
        map((errors) => (Object.keys(errors).length > 0 ? errors : null)),
        takeUntil(this.destroy$)
      )
      .subscribe((errors) => {
        this.matSelectControl.setErrors(errors);
      });
  }

  /**
   * @ignore
   */
  private filterOptions() {
    if (!this.options) {
      return;
    }

    // get the search keyword
    let search = (this.filterControl.value as string).trim();

    if (search) {
      search = search.toLowerCase();
    } else {
      return this.filteredOptions$.next(this.options.slice());
    }

    // filter the options
    this.filteredOptions$.next(
      this.options.filter(
        (option) => option.displayValue.toLowerCase().indexOf(search) > -1
      )
    );
  }

  /**
   * @ignore
   */
  private determineToggleAllCheckboxState(): void {
    this.filteredOptions$
      .pipe(
        take(1),
        map((options) => options.map((option) => option.value))
      )
      .subscribe((filteredOptions: string[]) => {
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
