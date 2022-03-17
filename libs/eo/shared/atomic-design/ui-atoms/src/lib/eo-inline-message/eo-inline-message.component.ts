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
  NgModule,
  ViewEncapsulation,
} from '@angular/core';

import { CommonModule } from '@angular/common';

export type inlineMessageType =
  | 'info'
  | 'success'
  | 'danger'
  | 'warning'
  | 'default';

const selector = 'eo-inline-message';

@Component({
  selector,
  styles: [
    `
      ${selector} {
        display: block;
      }
      .${selector}__container {
        display: grid;
        grid-template-columns: 70px 1fr;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.08);

        &.default {
          background: var(--watt-color-neutral-white);
          color: var(--watt-color-primary-dark);
        }
        &.info {
          background: var(--watt-color-state-info);
          color: var(--watt-color-neutral-white);
        }
        &.success {
          background: var(--watt-color-state-success);
          color: var(--watt-color-neutral-white);
        }
        &.danger {
          background: var(--watt-color-state-danger);
          color: var(--watt-color-neutral-white);
        }
        &.warning {
          background: #fef5d5; // var(--watt-color-state-warning); // Wrong yellow watt vs Figma
          color: var(--watt-color-primary-dark);
        }
      }
      .${selector}__icon {
        width: calc(8 * var(--watt-space-xs));
        height: calc(8 * var(--watt-space-xs));
        margin: calc(4 * var(--watt-space-xs));
      }
      .${selector}__content {
        padding-right: var(--watt-space-m);
      }
    `,
  ],
  template: `
    <div
      class="${selector}__container"
      [ngClass]="{
        info: type === 'info',
        success: type === 'success',
        danger: type === 'danger',
        warning: type === 'warning',
        default: type === 'default'
      }"
    >
      <div>
        <img
          *ngIf="icon"
          class="${selector}__icon"
          src="{{ icon }}"
          alt="EnergyOrigin"
        />
      </div>
      <div class="${selector}__content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class EoInlineMessageComponent {
  @Input()
  icon!: string;

  @Input()
  type: inlineMessageType = 'default';
}

@NgModule({
  imports: [CommonModule],
  declarations: [EoInlineMessageComponent],
  exports: [EoInlineMessageComponent],
})
export class EoInlineMessageScam {}
