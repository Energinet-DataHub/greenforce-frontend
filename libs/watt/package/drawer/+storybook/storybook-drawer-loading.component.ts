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
import { Component, viewChild } from '@angular/core';
import { RxPush } from '@rx-angular/template/push';
import { delay, distinctUntilChanged, map, tap, Observable, ReplaySubject } from 'rxjs';

import { WattButtonComponent } from '../../button';
import { WattDrawerComponent, WATT_DRAWER } from '../watt-drawer.component';

@Component({
  imports: [WattButtonComponent, WATT_DRAWER, RxPush],
  selector: 'watt-storybook-drawer-loading',
  template: `
    <watt-drawer #drawer size="small" [loading]="loading">
      <watt-drawer-topbar>
        @if (drawer.isOpen()) {
          <span>Top bar</span>
        }
      </watt-drawer-topbar>

      <watt-drawer-actions>
        <watt-button variant="secondary">Secondary action</watt-button>
        <watt-button>Primary action</watt-button>
      </watt-drawer-actions>

      @if (drawer.isOpen()) {
        <watt-drawer-content>{{ content$ | push }}</watt-drawer-content>
      }
    </watt-drawer>
    <watt-button (click)="open('first')">Open first</watt-button>
    <br />
    <br />
    <watt-button (click)="open('second')">Open second</watt-button>
  `,
})
export class WattStorybookDrawerLoadingComponent {
  private id$ = new ReplaySubject<string>(1);

  content$: Observable<string>;
  loading = false;

  drawer = viewChild.required(WattDrawerComponent);

  constructor() {
    this.content$ = this.id$.pipe(
      distinctUntilChanged<string>(),
      tap(() => {
        // Avoid `ExpressionChangedAfterItHasBeenCheckedError` in the wrapping component
        setTimeout(() => (this.loading = true));
      }),
      delay(1000),
      tap(() => (this.loading = false)),
      map((id) => `This is the ${id} drawer`)
    );
  }

  open(id: string) {
    this.drawer().open();
    this.id$.next(id);
  }
}
