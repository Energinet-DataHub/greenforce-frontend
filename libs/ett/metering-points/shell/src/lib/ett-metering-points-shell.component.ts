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
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattIconComponent } from '@energinet-datahub/watt/icon';

import { translations } from '@energinet-datahub/ett/translations';
import { EttMeteringPointsStore } from '@energinet-datahub/ett/metering-points/data-access-api';
import { EttMeteringPoint } from '@energinet-datahub/ett/metering-points/domain';

import { EttMeteringPointsTableComponent } from './ett-metering-point-table.component';
import { EttMeteringPointsHelperModalComponent } from './ett-metering-point-helper-modal.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    EttMeteringPointsTableComponent,
    WATT_CARD,
    TranslocoPipe,
    WattIconComponent,
    EttMeteringPointsHelperModalComponent,
  ],
  selector: 'ett-metering-points-shell',
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--watt-space-l);

        .title {
          display: flex;
          align-items: center;
          gap: var(--watt-space-xs);

          watt-icon {
            cursor: pointer;
          }
        }
      }
    `,
  ],
  template: ` <watt-card>
      <watt-card-title>
        <h3 class="watt-on-light--high-emphasis title">
          {{ translations.meteringPoints.tableTitle | transloco }}
          <watt-icon name="info" (click)="helper.open()" />
        </h3>
      </watt-card-title>
      <ett-metering-points-table
        [meteringPoints]="meteringPoints$ | async"
        [showPendingRelationStatus]="!!(showPendingRelationStatus$ | async)"
        [loading]="!!(isLoading$ | async)"
        [creatingContracts]="!!(creatingContracts$ | async)"
        [deactivatingContracts]="!!(deactivatingContracts$ | async)"
        [hasError]="!!(meteringPointError$ | async)"
        (activateContracts)="activateContracts($event)"
        (deactivateContracts)="deactivateContracts($event)"
      />
    </watt-card>

    <ett-metering-points-helper-modal #helper />`,
})
export class EttMeteringPointsShellComponent implements OnInit {
  private meteringPointStore = inject(EttMeteringPointsStore);
  private toastService = inject(WattToastService);
  private destroyRef = inject(DestroyRef);
  private transloco = inject(TranslocoService);
  @ViewChild('helper') helper!: EttMeteringPointsHelperModalComponent;

  protected isLoading$ = this.meteringPointStore.loading$;
  protected creatingContracts$ = this.meteringPointStore.creatingContracts$;
  protected deactivatingContracts$ = this.meteringPointStore.deativatingContracts$;
  protected meteringPoints$ = this.meteringPointStore.meteringPoints$;
  protected showPendingRelationStatus$: Observable<boolean> = combineLatest([
    this.meteringPoints$,
    this.meteringPointStore.relationStatus$,
  ]).pipe(
    map(([meteringPoints, status]) => {
      return status === 'Pending' || (!status && meteringPoints.length === 0);
    })
  );
  protected contractError$ = this.meteringPointStore.contractError$;
  protected meteringPointError$ = this.meteringPointStore.meteringPointError$;
  protected translations = translations;

  ngOnInit(): void {
    this.meteringPointStore.loadMeteringPoints();

    this.contractError$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((error: unknown) => {
      if (error) {
        this.toastService.open({
          message: this.transloco.translate(this.translations.meteringPoints.contractError),
          type: 'danger',
        });
      }
    });
  }

  activateContracts(meteringPoints: EttMeteringPoint[]) {
    this.meteringPointStore.createCertificateContracts(meteringPoints);
  }

  deactivateContracts(meteringPoints: EttMeteringPoint[]) {
    this.meteringPointStore.deactivateCertificateContracts(meteringPoints);
  }
}
