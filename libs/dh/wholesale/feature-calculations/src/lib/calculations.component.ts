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
import { Component, inject, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { TranslocoModule } from '@ngneat/transloco';
import { sub, startOfDay, endOfDay } from 'date-fns';
import { BehaviorSubject, Subject, switchMap, takeUntil } from 'rxjs';

import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

import {
  GetCalculationsDocument,
  GetCalculationsQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { Calculation } from '@energinet-datahub/dh/wholesale/domain';

import { DhCalculationsCreateComponent } from './create/create.component';
import { DhCalculationsDetailsComponent } from './details/details.component';
import { DhCalculationsFiltersComponent } from './filters/filters.component';
import { DhCalculationsTableComponent } from './table/table.component';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';

@Component({
  selector: 'dh-calculations',
  standalone: true,
  imports: [
    CommonModule,
    DhCalculationsCreateComponent,
    DhCalculationsDetailsComponent,
    DhCalculationsFiltersComponent,
    DhCalculationsTableComponent,
    TranslocoModule,
    VaterFlexComponent,
    VaterStackComponent,
    WATT_CARD,
    WattButtonComponent,
    WattPaginatorComponent,
    WattSearchComponent,
    WattSpinnerComponent,
  ],
  templateUrl: './calculations.component.html',
  styleUrls: ['./calculations.component.scss'],
})
export class DhCalculationsComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('details')
  details!: DhCalculationsDetailsComponent;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private apollo = inject(Apollo);
  private destroy$ = new Subject<void>();

  private routerId = this.route.snapshot.queryParams.id;

  selected?: Calculation;

  filter$ = new BehaviorSubject<GetCalculationsQueryVariables>({
    executionTime: {
      start: sub(startOfDay(new Date()), { days: 10 }).toISOString(),
      end: endOfDay(new Date()).toISOString(),
    },
  });

  calculations$ = this.filter$.pipe(
    switchMap(
      (variables) =>
        this.apollo.watchQuery({
          pollInterval: 10000,
          useInitialLoading: true,
          notifyOnNetworkStatusChange: true,
          fetchPolicy: 'cache-and-network',
          query: GetCalculationsDocument,
          variables: variables,
        }).valueChanges
    ),
    takeUntil(this.destroy$)
  );

  error = false;
  loading = false;
  search = '';
  calculations: Calculation[] = [];

  ngOnInit() {
    this.calculations$.subscribe({
      next: (result) => {
        this.loading = result.loading;

        if (result.data?.calculations) {
          this.calculations = result.data.calculations;
        }

        this.selected = this.calculations?.find((calculation) => calculation.id === this.routerId);
        this.error = !!result.errors;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });
  }

  ngAfterViewInit() {
    if (this.routerId) this.details.open(this.routerId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSelected(calculation: Calculation) {
    this.selected = calculation;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: calculation.id },
    });

    this.details.open(calculation.id);
  }

  onDetailsClosed() {
    this.selected = undefined;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: null },
    });
  }
}
