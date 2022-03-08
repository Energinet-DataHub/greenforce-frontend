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
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

export interface WattDropdownOption {
  value: string;
  displayValue: string;
}

@Component({
  selector: 'watt-dropdown',
  templateUrl: './watt-dropdown.component.html',
  styleUrls: ['./watt-dropdown.component.scss'],
})
export class WattDropdownComponent implements OnInit, AfterViewInit, OnDestroy {
  /** control for the selected bank */
  public internalControl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public internalFilterControl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredOptions: ReplaySubject<WattDropdownOption[]> =
    new ReplaySubject<WattDropdownOption[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect?: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  /**
   * Sets support for selecting multiple dropdown options.
   */
  @Input() multiple = false;

  /**
   * Sets the placeholder for the dropdown.
   *
   * @required
   */
  @Input() placeholder = '';

  /**
   *
   * Sets the options for the dropdown.
   */
  @Input() options: WattDropdownOption[] = [];

  @ViewChild(MatSelect)
  selectControl!: MatFormFieldControl<unknown>;

  ngOnInit() {
    // set initial selection
    // this.bankCtrl.setValue(this.banks[10]);

    // load the initial bank list
    this.filteredOptions.next(this.options.slice());

    // listen for search field value changes
    this.internalFilterControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
  }

  constructor() {
    console.log('Initialization dropdown');
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredOptions are loaded initially
        // and after the mat-option elements are available
        if (this.singleSelect) {
          this.singleSelect.compareWith = (
            a: WattDropdownOption,
            b: WattDropdownOption
          ) => a && b && a.value === b.value;
        }
      });
  }

  protected filterBanks() {
    if (!this.options) {
      return;
    }
    // get the search keyword
    let search = this.internalFilterControl.value;
    if (!search) {
      this.filteredOptions.next(this.options.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredOptions.next(
      this.options.filter(
        (option) => option.displayValue.toLowerCase().indexOf(search) > -1
      )
    );
  }
}
