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
import { Component, ViewEncapsulation, computed, input, linkedSignal, signal } from '@angular/core';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattJsonColorize } from './watt-json-colorize.component';

export type Json = { [key: string]: Json } | Json[] | string | number | boolean | null | unknown;
export type Ast =
  | { type: 'string'; value: string }
  | { type: 'number'; value: number }
  | { type: 'boolean'; value: boolean }
  | { type: 'array'; value: Json[] }
  | { type: 'object'; value: object }
  | { type: 'null'; value: null }
  | { type: 'unknown'; value: unknown };

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[watt-json]',
  encapsulation: ViewEncapsulation.None,
  imports: [WattIconComponent, WattJsonColorize],
  host: { '[class]': 'class()' },
  styles: `
    .watt-json-label {
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
  template: `
    <div class="watt-json-label" [style.paddingLeft.px]="20 * level()" (click)="handleClick()">
      @if (hasChildren()) {
        <watt-icon size="s" [name]="expanded() ? 'down' : 'right'" />
      }

      <span>{{ label() }}: </span>

      @if (!hasChildren() || !expanded()) {
        <watt-json-colorize [json]="ast().value" />
      }
    </div>
    @if (hasChildren()) {
      @for (child of children(); track child[0]) {
        <div
          [hidden]="!expanded()"
          watt-json
          [label]="child[0]"
          [json]="child[1]"
          [expandAll]="expandAll()"
          [level]="level() + 1"
        ></div>
      }
    }
  `,
})
export class WattJson {
  readonly label = input('');
  readonly json = input.required<Json>();
  readonly expandAll = input(true);
  readonly level = input(0);

  protected readonly expanded = linkedSignal(this.expandAll);
  protected readonly ast = computed<Ast>(() => {
    // TODO: Can we simplify this? Maybe also JSON.stringify in here, to simplify template?
    const json = this.json();
    switch (typeof json) {
      case 'string':
        return { type: 'string', value: json };
      case 'number':
        return { type: 'number', value: json };
      case 'boolean':
        return { type: 'boolean', value: json };
      case 'object':
        if (json === null) return { type: 'null', value: json };
        return json instanceof Array
          ? { type: 'array', value: json }
          : { type: 'object', value: json };
      default:
        // or we could just filter?
        return { type: 'unknown', value: typeof json };
    }
  });

  protected readonly type = computed(() => this.ast()?.type ?? 'unknown');
  protected readonly hasChildren = computed(() => ['object', 'array'].includes(this.type()));
  protected readonly children = computed(() => Object.entries(this.ast()?.value ?? {}));
  protected readonly class = computed(() => `watt-json--${this.type()}`);
  protected readonly handleClick = () => this.expanded.update((e) => !e);
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'watt-json-viewer',
  encapsulation: ViewEncapsulation.None,
  imports: [WattJson],
  styles: `
    watt-json-viewer,
    [watt-json-viewer] {
      display: block;
      cursor: default;
    }
  `,
  template: `
    <button (click)="expandAll.set(!expandAll())">Expand all</button>
    <div watt-json [json]="json()" [expandAll]="expandAll()"></div>
  `,
})
export class WattJsonViewer {
  readonly json = input.required<Json>();
  protected expandAll = signal(true);
}
