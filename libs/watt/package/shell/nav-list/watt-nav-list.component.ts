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
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  contentChildren,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';

import { WattExpandOnActiveLinkDirective } from './watt-expand-on-active-link.directive';
import { WattNavListItemComponent } from './watt-nav-list-item.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-nav-list',
  styleUrl: './watt-nav-list.component.scss',
  host: {
    '[class.watt-nav-list--expandable]': 'expandable()',
  },
  template: `
    @if (expandable()) {
      <mat-expansion-panel
        wattExpandOnActiveLink
        [wattNavListItemComponents]="navListItemComponents()"
        class="mat-elevation-z0"
      >
        <mat-expansion-panel-header>
          <mat-panel-title class="watt-text-m">{{ title() }}</mat-panel-title>
        </mat-expansion-panel-header>
        <ng-container *ngTemplateOutlet="navListTemplate" />
      </mat-expansion-panel>
    } @else {
      <ng-container *ngTemplateOutlet="navListTemplate" />
    }

    <ng-template #navListTemplate>
      <ng-content />
    </ng-template>
  `,
  imports: [NgTemplateOutlet, RouterModule, MatExpansionModule, WattExpandOnActiveLinkDirective],
})
export class WattNavListComponent {
  /**
   * @ignore
   */
  navListItemComponents = contentChildren(WattNavListItemComponent);

  expandable = input(false);
  title = input('');
}
