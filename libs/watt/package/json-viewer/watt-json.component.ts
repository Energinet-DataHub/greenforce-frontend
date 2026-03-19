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
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  linkedSignal,
} from '@angular/core';
import { VATER } from '@energinet/watt/vater';
import { WattJsonRow } from './watt-json-row.component';
import { interleave, isNonEmpty, isEqual } from './watt-json.utils';

export type TreeState = {
  expanded: boolean;
  maxDepth: number;
};

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'watt-json',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VATER, WattJsonRow],
  styles: `
    watt-json {
      cursor: default;
    }

    .watt-json-row {
      position: relative;
    }

    .watt-json-row::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0);
      pointer-events: none;
    }

    .watt-json-row:hover::after {
      background-color: rgba(0, 0, 0, 0.1);
      outline: 1px solid var(--watt-color-neutral-grey-500);
      outline-offset: -1px;
    }
  `,
  host: { '[style.--watt-json-level]': 'level()' },
  template: `
    @if (!isRoot()) {
      <vater-flex class="watt-json-row" direction="row" (click)="toggleExpanded()">
        @if (diff()) {
          <watt-json-row
            [label]="label()"
            [isBaseline]="true"
            [isSame]="isSame()"
            [expanded]="expanded()"
            [value]="baseline()"
          />
        }
        <watt-json-row
          [label]="label()"
          [isBaseline]="false"
          [isSame]="isSame()"
          [expanded]="expanded()"
          [value]="json()"
        />
      </vater-flex>
    }
    @defer (when expanded()) {
      @for (child of children(); track child.key) {
        <watt-json
          [hidden]="!expanded()"
          [label]="child.key"
          [json]="child.json"
          [baseline]="child.baseline"
          [diff]="diff()"
          [tree]="tree()"
          [level]="level() + 1"
        />
      }
    }
  `,
})
export class WattJson {
  readonly label = input<string>();
  readonly json = input<unknown>();
  readonly baseline = input<unknown>();
  readonly diff = input(false);
  readonly tree = input.required<TreeState>();
  readonly level = input(0);

  protected readonly toMap = (v: unknown) => new Map(Object.entries(isNonEmpty(v) ? v : []));
  protected readonly children = computed(() => {
    const json = this.toMap(this.json());
    const baseline = this.toMap(this.baseline());
    const keys = new Set(interleave([...json.keys()], [...baseline.keys()]));
    return [...keys].map((key) => ({ key, json: json.get(key), baseline: baseline.get(key) }));
  });

  protected readonly isRoot = computed(() => this.level() === 0);
  protected readonly isSame = computed(() => {
    if (!this.diff()) return true;
    return isEqual(this.baseline(), this.json(), { deep: !this.expanded() });
  });

  protected readonly expandable = computed(() => this.children().length > 0);
  protected readonly expanded = linkedSignal({
    source: this.tree,
    computation: (t) =>
      this.level() < t.maxDepth && t.expanded ? this.expandable() : this.isRoot(),
  });

  protected readonly toggleExpanded = () =>
    // Prevent toggle when text is being selected
    this.expanded.update((e) => (getSelection()?.isCollapsed && this.expandable() ? !e : e));
}
