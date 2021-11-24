/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
  NgModule,
  OnInit,
} from '@angular/core';
import { LocalRouterStore } from '@ngworker/router-component-store';
import { TranslocoModule } from '@ngneat/transloco';

import { WattEmptyStateModule } from '@energinet-datahub/watt';

import { dhMeteringPointPath } from '@energinet-datahub/dh/metering-point/routing';
import { DhMeteringPointSearchFormScam } from './form/dh-metering-point-search-form.component';
import { filter, take } from 'rxjs';
import { PushModule } from '@rx-angular/template';
import { Router } from '@angular/router';

// TODO: Should be removed:
import { DhDataAccessMeteringPointStore } from './should-be-removed/dh-data-access-metering-point.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-search',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        display: block;
        max-width: 844px;
        margin: 0 auto;
      }

      h1 {
        color: var(--watt-color-primary-dark);
        margin-left: -2px; // todo: Why is this needed?
        margin-bottom: var(--watt-space-s);
      }

      watt-empty-state {
        margin-top: var(--watt-space-xl);
      }
    `,
  ],
  template: `
    <ng-container *transloco="let transloco; read: 'meteringPoint.search'">
      <h1>{{ transloco('title') }}</h1>

      <dh-metering-point-search-form
        [loading]="isLoading$ | push"
        (search)="onSubmit($event)"
      ></dh-metering-point-search-form>

      <watt-empty-state
        *ngIf="notFound$ | push"
        icon="explore"
        [title]="transloco('noMeteringPointFoundTitle')"
        [message]="transloco('noMeteringPointFoundMessage')"
      ></watt-empty-state>
    </ng-container>
  `,
  providers: [LocalRouterStore, DhDataAccessMeteringPointStore],
})
export class DhMeteringPointSearchComponent implements OnInit {
  isLoading$ = this.store.select((state) => state.isLoading);
  notFound$ = this.store.select((state) => state.notFound);
  hasError$ = this.store.select((state) => state.hasError);
  meteringPointLoaded$ = this.store
    .select((state) => state.meteringPoint)
    .pipe(
      filter((x) => !!x),
      take(1)
    );

  constructor(
    private router: Router,
    private store: DhDataAccessMeteringPointStore
  ) {}

  ngOnInit() {
    this.meteringPointLoaded$.subscribe((meteringPoint) => {
      this.router.navigate([
        `/${dhMeteringPointPath}/${meteringPoint?.gsrnNumber}`,
      ]);
    });
  }

  onSubmit(id: string) {
    this.store.setState({
      meteringPoint: undefined,
      isLoading: true,
      hasError: false,
      notFound: false,
    });
    this.store.loadMeteringPointData(id);
  }
}

@NgModule({
  imports: [
    DhMeteringPointSearchFormScam,
    WattEmptyStateModule,
    TranslocoModule,
    PushModule,
    CommonModule,
  ],
  declarations: [DhMeteringPointSearchComponent],
})
export class DhMeteringPointSearchScam {}
