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
import { Component, ViewEncapsulation, computed, input, linkedSignal } from '@angular/core';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattJsonColorize } from './watt-json-colorize.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[watt-json]',
  encapsulation: ViewEncapsulation.None,
  imports: [WattIconComponent, WattJsonColorize],
  styles: `
    .watt-json-label {
      position: relative;
      color: var(--watt-color-primary);
      padding-left: calc(var(--watt-json-level) * 20px);
    }

    .watt-json-label:hover {
      background: var(--watt-color-neutral-grey-100);
    }

    .watt-json-label > watt-icon {
      position: absolute;
      top: 2px;
      transform: translateX(-100%);
    }
  `,
  template: `
    <div class="watt-json-label" [style.--watt-json-level]="level()" (click)="toggleExpanded()">
      @if (expandable() && children()) {
        <watt-icon size="s" [name]="expanded() ? 'down' : 'right'" />
      }

      @if (label()) {
        <span>{{ label() }}: </span>
      }

      @if (!children() || (expandable() && !expanded())) {
        <watt-json-colorize [json]="json()" />
      }
    </div>
    @defer (when expanded() || !expandable()) {
      @for (child of children(); track child[0]) {
        <div
          watt-json
          [hidden]="expandable() && !expanded()"
          [label]="child[0]"
          [json]="child[1]"
          [tree]="tree()"
          [level]="level() + 1"
        ></div>
      }
    }
  `,
})
export class WattJson {
  readonly label = input('');
  readonly json = input.required<unknown>();
  readonly tree = input({ expanded: false, maxDepth: 50 });
  readonly expandable = input(true);
  readonly level = input(0);

  protected readonly expanded = linkedSignal(() =>
    this.level() < this.tree().maxDepth ? this.tree().expanded : false
  );
  protected readonly toggleExpanded = () => this.expanded.update((e) => !e);
  protected readonly children = computed(() => {
    const json = this.json();
    return typeof json === 'object' && json && Object.keys(json).length
      ? Object.entries(json)
      : null;
  });
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'watt-json-viewer',
  encapsulation: ViewEncapsulation.None,
  imports: [WattJson],
  styles: `
    watt-json-viewer {
      display: block;
      cursor: default;
    }
  `,
  template: `<div watt-json [json]="json()" [expandable]="false" [tree]="tree()"></div>`,
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
  protected readonly tree = computed(() => ({
    expanded: this.expanded(),
    maxDepth: this.maxDepth(),
  }));
}
