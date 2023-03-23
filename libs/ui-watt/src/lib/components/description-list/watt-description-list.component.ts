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
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  HostBinding,
  inject,
  Input,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';

import { WattDescriptionListItemComponent } from './watt-description-list-item.component';
/**
 * Usage:
 * `import { WattDescriptionListComponent } from '@energinet-datahub/watt/description-list';`
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-description-list',
  styleUrls: ['./watt-description-list.component.scss'],
  templateUrl: './watt-description-list.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
class WattDescriptionListComponent<T> implements AfterViewInit {
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  @ContentChildren(WattDescriptionListItemComponent)
  public readonly descriptionItems: QueryList<WattDescriptionListItemComponent<T>> = new QueryList<
    WattDescriptionListItemComponent<T>
  >();
  @Input() variant: 'flow' | 'stack' = 'flow';
  @HostBinding('class')
  get cssClass() {
    return `watt-description-list-${this.variant}`;
  }
  @HostBinding('style.--watt-description-list-groups-per-row')
  @Input()
  groupsPerRow!: number;

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}

export { WattDescriptionListComponent, WattDescriptionListItemComponent };
