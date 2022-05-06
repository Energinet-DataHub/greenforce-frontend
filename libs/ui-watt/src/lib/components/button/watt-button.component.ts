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
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { WattIcon } from '../../foundations/icon';

export const WattButtonTypes = [
  'primary',
  'secondary',
  'text',
  'icon',
] as const;
export type WattButtonVariant = typeof WattButtonTypes[number];
export type WattButtonSize = 'normal' | 'large';

@Component({
  selector: 'watt-button',
  template: `
    <button
      mat-button
      [ngClass]="['watt-button--' + variant, 'watt-button--' + size]"
      [disabled]="disabled"
    >
      <watt-spinner
        *ngIf="loading"
        [diameter]="18"
        class="content-grid-item content-grid-item-spinner"
      ></watt-spinner>
      <watt-icon *ngIf="!loading && hasIcon()" [name]="icon"></watt-icon>
      <ng-content *ngIf="!loading && variant !== 'icon'"></ng-content>
    </button>
  `,
  styleUrls: ['./watt-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WattButtonComponent {
  @Input() icon?: WattIcon;
  @Input() variant: WattButtonVariant = 'primary';
  @Input() size: WattButtonSize = 'normal';
  @Input() disabled = false;
  @Input() loading = false;

  hasIcon(): boolean {
    return !!this.icon;
  }
}
