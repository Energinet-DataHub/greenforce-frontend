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

import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-nav-list-item',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatRippleModule],
  template: `
    <a
      *ngIf="isExternalLink; else internalLink"
      mat-list-item
      mat-ripple
      [href]="link"
      [attr.target]="target"
      ><ng-container *ngTemplateOutlet="templateContent"></ng-container
    ></a>

    <ng-template #internalLink>
      <a
        mat-list-item
        mat-ripple
        [routerLink]="link"
        routerLinkActive="active"
        (isActiveChange)="onRouterLinkActive($event)"
        ><ng-container *ngTemplateOutlet="templateContent"></ng-container
      ></a>
    </ng-template>

    <ng-template #templateContent>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class WattNavListItemComponent {
  @Input() link: string | null = null;
  @Input() target: '_self' | '_blank' | '_parent' | '_top' | null = null;

  @Output() isActive = new EventEmitter<boolean>();

  get isExternalLink(): boolean {
    return /^(http:\/\/|https:\/\/)/i.test(this.link ?? '');
  }

  onRouterLinkActive(isActive: boolean) {
    this.isActive.emit(isActive);
  }
}
