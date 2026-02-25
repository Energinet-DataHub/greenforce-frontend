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

export type TreeState = {
  expanded: boolean;
  maxDepth: number;
};

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'watt-json',
  encapsulation: ViewEncapsulation.None,
  imports: [WattIconComponent, WattJsonColorize],
  styles: `
    watt-json {
      cursor: default;
    }

    .watt-json-label {
      position: relative;
      padding-left: calc(var(--watt-json-level) * 20px);
      color: var(--watt-color-primary);
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
  host: { '[style.--watt-json-level]': 'level()' },
  template: `
    @if (!isRoot()) {
      <div class="watt-json-label" (click)="toggleExpanded()">
        @if (expandable()) {
          <watt-icon size="s" [name]="expanded() ? 'down' : 'right'" />
        }
        <span>{{ label() }}: </span>
        <watt-json-colorize [hidden]="expanded()" [json]="json()" />
      </div>
    }
    @defer (when expanded()) {
      @for (child of children(); track child[0]) {
        <watt-json
          [hidden]="!expanded()"
          [label]="child[0]"
          [json]="child[1]"
          [tree]="tree()"
          [level]="level() + 1"
        />
      }
    }
  `,
})
export class WattJson {
  readonly label = input<string>();
  readonly json = input.required<unknown>();
  readonly tree = input.required<TreeState>();
  readonly level = input(0);

  protected readonly isRoot = computed(() => this.level() === 0);
  protected readonly children = computed(() => {
    const json = this.json();
    return typeof json === 'object' && json && Object.keys(json).length
      ? Object.entries(json)
      : null;
  });

  // The linkedSignal makes it possible to recursively toggle all nodes
  protected readonly expandable = computed(() => Boolean(this.children()));
  protected readonly expanded = linkedSignal({
    source: this.tree,
    computation: (t) =>
      this.level() < t.maxDepth && t.expanded ? this.expandable() : this.isRoot(),
  });

  protected readonly toggleExpanded = () =>
    // Prevent toggle when text is being selected
    this.expanded.update((e) => (getSelection()?.isCollapsed && this.expandable() ? !e : e));
}
