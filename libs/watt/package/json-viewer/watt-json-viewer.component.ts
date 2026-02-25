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
import { Component, computed, input, linkedSignal } from '@angular/core';
import { TreeState, WattJson } from './watt-json.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'watt-json-viewer',
  imports: [WattJson],
  template: `<watt-json [json]="json()" [tree]="tree()" />`,
})
export class WattJsonViewer {
  /**
   * The JSON data to display. Accepts any value that can be serialized by JSON.stringify.
   */
  readonly json = input.required<unknown>();

  /**
   * Maximum depth for `expandAll()`. Beyond this depth nodes start collapsed but can be
   * expanded manually. Useful when dealing with large objects or circular references.
   */
  readonly maxDepth = input(50);

  /**
   * Whether the tree starts expanded or collapsed.
   */
  readonly initialExpanded = input(false);

  /**
   * Expands all nodes up to `maxDepth`.
   */
  readonly expandAll = () => this.expanded.set(true);

  /**
   * Collapses all nodes.
   */
  readonly collapseAll = () => this.expanded.set(false);

  // Use equality function + computed object to always return a new reference, even
  // when `expanded` is "updated" to its current value. This ensures that "Expand all"
  // and "Collapse all" always works, regardless of the current state of `expanded`.
  protected readonly expanded = linkedSignal(this.initialExpanded, { equal: () => false });
  protected readonly tree = computed<TreeState>(() => ({
    expanded: this.expanded(),
    maxDepth: this.maxDepth(),
  }));
}
