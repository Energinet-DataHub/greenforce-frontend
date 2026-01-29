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
import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import { VaterUtilityDirective } from './vater-utility.directive';
import { VaterLayoutDirective } from './vater-layout.directive';

@Component({
  selector: 'vater-grid-area, [vater-grid-area]',
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [
    {
      directive: VaterLayoutDirective,
      inputs: ['gap', 'offset'],
    },
    {
      directive: VaterUtilityDirective,
      inputs: ['fill', 'scrollable'],
    },
  ],
  host: {
    '[class]': 'class()',
    '[style.gridColumn]': 'column()',
    '[style.gridRow]': 'row()',
  },
  template: `<ng-content />`,
})
export class VaterGridAreaComponent {
  /** Optional input for providing a descriptive name. Unused by the component. */
  name = input('');

  /** Specify the grid areas size and location within a grid column (`grid-column`). */
  column = input<string | number>();

  /** Specify the grid areas size and location within a grid row (`grid-row`). */
  row = input<string | number>();

  /**
   * Whether the grid area should also be a grid and inherit track sizing
   * for `columns`, `rows` or `both` from the parent grid.
   */
  subgrid = input<'columns' | 'rows' | 'both'>();

  // Computed class name
  protected class = computed(() => this.subgrid() && `vater-subgrid-${this.subgrid()}`);
}
