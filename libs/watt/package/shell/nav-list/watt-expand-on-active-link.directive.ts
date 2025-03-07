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
import { Directive, AfterViewInit, inject, input } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { from, filter, mergeMap } from 'rxjs';

import { WattNavListItemComponent } from './watt-nav-list-item.component';

@Directive({
  selector: '[wattExpandOnActiveLink]',
  exportAs: 'wattExpandOnActiveLink',
})
export class WattExpandOnActiveLinkDirective implements AfterViewInit {
  private panel = inject(MatExpansionPanel);

  wattNavListItemComponents = input<readonly WattNavListItemComponent[]>([]);

  ngAfterViewInit(): void {
    const navListItems = this.wattNavListItemComponents();

    if (navListItems.length > 0) {
      from(this.wattNavListItemComponents())
        .pipe(
          mergeMap((item) => outputToObservable(item.isActive)),
          filter((isActive) => isActive)
        )
        .subscribe(() => this.panel.open());
    }
  }
}
