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
import { Component, ElementRef, HostBinding, NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'a[watt-nav-list-item]',
  exportAs: 'wattNavListItem',
  templateUrl: './watt-nav-list-item.component.html',
})
export class WattNavListItemComponent {
  @HostBinding('class') get baseClass() {
    return 'mat-list-item mat-focus-indicator';
  }

  constructor(private element: ElementRef<HTMLElement>) {}

  /** Retrieves the DOM element of the component host. */
  getHostElement(): HTMLElement {
    return this.element.nativeElement;
  }
}

@NgModule({
  declarations: [WattNavListItemComponent],
  exports: [WattNavListItemComponent],
  imports: [MatRippleModule],
})
export class WattNavListItemScam {}
