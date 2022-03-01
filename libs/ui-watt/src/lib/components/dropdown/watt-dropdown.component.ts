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
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, of, startWith } from 'rxjs';

export interface WattDropdownOption {
  value: string;
  displayValue: string;
}

@Component({
  selector: 'watt-dropdown',
  templateUrl: './watt-dropdown.component.html',
  styleUrls: ['./watt-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WattDropdownComponent implements OnInit {
  /**
   * @ignore
   */
  internalControl = new FormControl();

  filteredOptions: Observable<WattDropdownOption[]> = of([]);

  /**
   * Sets the label for the dropdown.
   *
   * @required
   */
  @Input() label = '';

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

  ngOnInit() {
    this.filteredOptions = this.internalControl.valueChanges.pipe(
      startWith(''),
      map((value: string | WattDropdownOption) =>
        typeof value === 'string' ? value.trim() : value.displayValue
      ),
      map((name) => (name ? this.filter(name) : this.options.slice()))
    );
  }

  displayFn(option: WattDropdownOption | null): string {
    return option?.displayValue ?? '';
  }

  private filter(value: string): WattDropdownOption[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.displayValue.toLowerCase().includes(filterValue)
    );
  }
}
