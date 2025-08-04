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
import { Component, EventEmitter, input } from '@angular/core';

import { WattChipComponent } from './watt-chip.component';

function isFirstRender() {
  let isFirstRender = true;
  return () => {
    if (!isFirstRender) return false;
    isFirstRender = false;
    return true;
  };
}

@Component({
  imports: [WattChipComponent],
  selector: 'watt-filter-chip',
  template: `
    <watt-chip [disabled]="disabled()" [selected]="isFirstRender() ? selected() : inputElement.checked">
      <input
        #inputElement
        class="cdk-visually-hidden"
        [type]="choice() === undefined ? 'checkbox' : 'radio'"
        [name]="name()"
        [value]="value()"
        [checked]="selected()"
        [disabled]="disabled()"
        (change)="onChange(inputElement)"
      />
      <ng-content />
    </watt-chip>
  `,
})
export class WattFilterChipComponent<T = string> {
  selected = input(false);
  disabled = input(false);
  name = input<string>();
  value = input<T>();
  choice = input<string>();
  selectionChange = new EventEmitter<T>();
  isFirstRender = isFirstRender();

  onChange(inputElement: HTMLInputElement): void {
    if (this.choice() !== undefined) {
      // For radio buttons (choice mode), emit the component's typed value
      this.selectionChange.emit(this.value()!);
    } else {
      // For checkboxes, emit the checked state
      this.selectionChange.emit(inputElement.checked as T);
    }
  }
}
