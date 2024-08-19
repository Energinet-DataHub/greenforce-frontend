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
import {
  Component,
  ViewChild,
  inject,
  Output,
  EventEmitter,
  effect,
  Injector,
  input,
} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattDatePipe } from '@energinet-datahub/watt/utils/date';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { WATT_PROGRESS_TRACKER } from '@energinet-datahub/watt/progress-tracker';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { GetCalculationByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { Calculation } from '@energinet-datahub/dh/wholesale/domain';

import { DhCalculationsGridAreasTableComponent } from '../grid-areas/table.component';
import { VaterFlexComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';

@Component({
  standalone: true,
  imports: [
    TranslocoDirective,

    WATT_DRAWER,
    WATT_PROGRESS_TRACKER,
    WattBadgeComponent,
    WattDatePipe,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattEmptyStateComponent,
    WattSpinnerComponent,
    VaterFlexComponent,
    VaterUtilityDirective,

    DhCalculationsGridAreasTableComponent,
    DhEmDashFallbackPipe,
  ],
  selector: 'dh-calculations-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DhCalculationsDetailsComponent {
  private apollo = inject(Apollo);
  private injector = inject(Injector);

  @Output() closed = new EventEmitter<void>();
  id = input<string>();

  @ViewChild(WattDrawerComponent)
  drawer!: WattDrawerComponent;

  calculation?: Calculation;
  error = false;
  loading = false;

  constructor() {
    effect(() => {
      const id = this.id();
      if (!id) return;
      this.drawer.open();
      const subscription = this.apollo
        .watchQuery({
          errorPolicy: 'all',
          returnPartialData: true,
          query: GetCalculationByIdDocument,
          variables: { id },
        })
        .valueChanges.subscribe({
          next: (result) => {
            this.calculation = result.data?.calculationById ?? undefined;
            this.loading = result.loading;
            this.error = !!result.errors;
          },
          error: (error) => {
            this.error = error;
            this.loading = false;
          },
        });

      return () => subscription.unsubscribe();
    });
  }
}
