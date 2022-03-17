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
  AfterViewInit,
  Component,
  Host,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AsyncValidatorFn,
  ControlValueAccessor,
  FormControl,
  NgControl,
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
  take,
  takeUntil,
} from 'rxjs';

import {
  WattDropdownOption,
  WattDropdownOptions,
} from './watt-dropdown-option';

@Component({
  selector: 'watt-dropdown',
  templateUrl: './watt-dropdown.component.html',
  styleUrls: ['./watt-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WattDropdownComponent
  implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy
{
  /** Subject that emits when the component has been destroyed. */
  /**
   * @ignore
   */
  private destroy$ = new Subject<void>();
  /**
   * @ignore
   */
  private parentControl?: FormControl;
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
  matSelectControl = new FormControl(null, { updateOn: 'blur' });

  /**
   * Control for the MatSelect filter keyword
   *
   * @ignore
   */
  filterControl = new FormControl();

  /**
   * List of options filtered by search keyword
   *
   * @ignore
   */
  filteredOptions = new ReplaySubject<WattDropdownOptions>(1);

  /**
   * @ignore
   */
  @ViewChild('matSelect', { static: true }) matSelect?: MatSelect;

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
   * Sets the placeholder for the dropdown.
   */
  @Input() placeholder = '';

  /**
   * Label to be shown when no entries are found.
   */
  @Input() noEntriesFoundLabel = '';

  constructor(@Host() private parentControlDirective: NgControl) {
    this.parentControlDirective.valueAccessor = this;
  }

  /**
   * @ignore
   */
  ngOnInit(): void {
    this.unsetMaterialXOffset();

    // load the initial list of options
    this.filteredOptions.next(this.options.slice());

    this.listenForFilterFieldValueChanges();
    this.initializePropertiesFromParent();
    this.bindParentValidatorsToControl();
    this.bindControlToParent();
  }

  /**
   * @ignore
   */
  ngAfterViewInit(): void {
    this.setInitialValue();
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
  writeValue(value: WattDropdownOption | WattDropdownOptions | null): void {
    this.matSelectControl.setValue(value);
  }

  /**
   * @ignore
   */
  registerOnChange(
    onChangeFn: (value: WattDropdownOption | WattDropdownOptions | null) => void
  ): void {
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
   * @ignore
   */
  private unsetMaterialXOffset() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const select: any = this.matSelect;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    select._positioningSettled = () => {};
  }

  /**
   * @ignore
   */
  private listenForFilterFieldValueChanges() {
    this.filterControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.filterOptions());
  }

  /**
   * @ignore
   */
  private changeParentValue = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    value: WattDropdownOption | WattDropdownOptions | null
  ): void => {
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
    this.parentControl = this.parentControlDirective.control as FormControl;

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
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value: WattDropdownOption | WattDropdownOptions | null) => {
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
   *
   * Sets the initial value after the filteredOptions are loaded initially
   */
  private setInitialValue() {
    this.filteredOptions
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredOptions are loaded initially
        // and after the mat-option elements are available
        if (this.matSelect) {
          this.matSelect.compareWith = (
            a: WattDropdownOption,
            b: WattDropdownOption
          ) => a && b && a.value === b.value;
        }
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
      return this.filteredOptions.next(this.options.slice());
    }

    // filter the options
    this.filteredOptions.next(
      this.options.filter(
        (option) => option.displayValue.toLowerCase().indexOf(search) > -1
      )
    );
  }
}
