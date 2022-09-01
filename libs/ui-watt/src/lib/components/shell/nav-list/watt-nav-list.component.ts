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

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

import { WattExpandOnActiveLinkDirective } from './watt-expand-on-active-link.directive';
import { WattNavListItemComponent } from './watt-nav-list-item.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-nav-list',
  styleUrls: ['./watt-nav-list.component.scss'],
  templateUrl: './watt-nav-list.component.html',
  standalone: true,
  imports: [
    MatListModule,
    CommonModule,
    RouterModule,
    MatExpansionModule,
    WattNavListItemComponent,
    WattExpandOnActiveLinkDirective,
  ],
})
export class WattNavListComponent {
  /**
   * @ignore
   */
  @ContentChildren(WattNavListItemComponent)
  navListItemComponents: QueryList<WattNavListItemComponent> | null = null;

  @Input()
  expandable = false;

  @Input()
  title = '';

  /**
   * @ignore
   */
  @HostBinding('class.watt-nav-list--expandable')
  get expandableClass() {
    return this.expandable;
  }
}
