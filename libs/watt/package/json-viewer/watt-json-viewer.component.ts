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
import { JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, ViewEncapsulation, computed, input, linkedSignal, signal } from '@angular/core';
import { VATER } from '@energinet/watt/vater';
import { WattIconComponent } from '@energinet/watt/icon';

export type Json = { [key: string]: Json } | Json[] | string | number | boolean | null;
export type Ast =
  | { type: 'string'; value: string }
  | { type: 'number'; value: number }
  | { type: 'boolean'; value: boolean }
  | { type: 'array'; value: Json[] }
  | { type: 'object'; value: object }
  | { type: 'null'; value: null }
  | null;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[watt-json]',
  encapsulation: ViewEncapsulation.None,
  imports: [JsonPipe, KeyValuePipe, VATER, WattIconComponent],
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

    .watt-json--string .watt-json-literal {
      color: var(--watt-color-state-success);
    }

    .watt-json--number .watt-json-literal {
      color: var(--watt-color-state-warning);
    }

    .watt-json--null .watt-json-literal,
    .watt-json--boolean .watt-json-literal {
      color: var(--watt-color-state-danger);
    }

    .watt-json-raw {
      color: var(--watt-on-light-low-emphasis);
    }
  `,
  template: `
    @if (ast(); as ast) {
      @if (expandable()) {
        <div
          class="watt-json-label"
          [style.paddingLeft.px]="20 * level()"
          (click)="expanded.set(!expanded())"
        >
          <watt-icon size="s" [name]="expanded() ? 'down' : 'right'" />
          {{ label() }}:
          @if (!expanded()) {
            <span class="watt-json-raw">{{ ast.value | json }}</span>
          }
        </div>
        @switch (ast.type) {
          @case ('array') {
            @for (value of ast.value; track $index) {
              <div
                [hidden]="!expanded()"
                watt-json
                label="[{{ $index }}]"
                [json]="value"
                [expandAll]="expandAll()"
                [level]="level() + 1"
              ></div>
            }
          }
          @case ('object') {
            @for (property of ast.value | keyvalue: null; track $index) {
              <div
                [hidden]="!expanded()"
                watt-json
                [label]="property.key"
                [expandAll]="expandAll()"
                [json]="property.value"
                [level]="level() + 1"
              ></div>
            }
          }
        }
      } @else {
        <div
          class="watt-json-label"
          [style.paddingLeft.px]="20 * level()"
          (click)="expanded.set(!expanded())"
        >
          {{ label() }}: <span class="watt-json-literal">{{ ast.value | json }}</span>
        </div>
      }
    } @else {
      Invalid JSON
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
        return null;
    }
  });

  protected readonly type = computed(() => this.ast()?.type ?? 'unknown');
  protected readonly expandable = computed(
    () => this.type() === 'object' || this.type() === 'array'
  );
  protected readonly class = computed(() => `watt-json--${this.type()}`);
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
