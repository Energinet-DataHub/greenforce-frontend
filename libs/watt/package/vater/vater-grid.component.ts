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
  selector: 'vater-grid, [vater-grid]',
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [
    {
      directive: VaterLayoutDirective,
      inputs: ['gap', 'offset', 'justify', 'align'],
    },
    {
      directive: VaterUtilityDirective,
      inputs: ['center', 'fill', 'inset', 'scrollable', 'sticky'],
    },
  ],
  host: {
    '[style.gridTemplateColumns]': 'templateColumns()',
    '[style.gridTemplateRows]': 'templateRows()',
    '[style.gridAutoColumns]': 'autoColumns()',
    '[style.gridAutoRows]': 'autoRows()',
    '[style.gridAutoFlow]': 'flow()',
  },
  styles: `
    vater-grid,
    [vater-grid] {
      display: grid;
    }
  `,
  template: `<ng-content />`,
})
export class VaterGridComponent {
  /** Column template (`grid-template-columns`) or number of equal sized columns. */
  columns = input<string | number>();

  /** Row template (`grid-template-rows`) or number of equal sized rows. */
  rows = input<string | number>();

  /** Column template for implicitly-created columns (`grid-auto-columns`). */
  autoColumns = input<string>();

  /** Row template for implicitly-created rows (`grid-auto-rows`). */
  autoRows = input<string>();

  /** Specifies how auto-placed items flows into the grid (`grid-auto-flow`). */
  flow = input<'row' | 'column'>();

  // Computed templates
  protected templateColumns = computed(() => this.makeTrackList(this.columns()));
  protected templateRows = computed(() => this.makeTrackList(this.rows()));
  private makeTrackList = (input?: string | number) =>
    typeof input === 'number' ? 'auto '.repeat(input).trim() : input;
}
