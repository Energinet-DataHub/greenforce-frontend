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
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';

import { translations } from '@energinet-datahub/eo/translations';
import { EoMeteringPointsStore } from '@energinet-datahub/eo/metering-points/data-access-api';
import { MeteringPointType } from '@energinet-datahub/eo/metering-points/domain';

import { EoMeteringPointsTableComponent } from './eo-metering-point-table.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    EoMeteringPointsTableComponent,
    WATT_CARD,
    WattValidationMessageComponent,
    TranslocoPipe,
  ],
  selector: 'eo-metering-points-shell',
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--watt-space-l);
      }
    `,
  ],
  template: `
    <watt-validation-message
      label="{{ translations.meteringPoints.infoBoxTitle | transloco }}"
      size="normal"
      icon="info"
      [autoScrollIntoView]="false"
    >
      <span [innerHTML]="translations.meteringPoints.infoBoxContent | transloco"></span>
    </watt-validation-message>

    <watt-card>
      <watt-card-title>
        <h3 class="watt-on-light--high-emphasis">
          {{ translations.meteringPoints.tableTitle | transloco }}
        </h3>
      </watt-card-title>
      <eo-metering-points-table
        [meteringPoints]="meteringPoints$ | async"
        [loading]="!!(isLoading$ | async)"
        [hasError]="!!(meteringPointError$ | async)"
        (toggleContract)="onToggleContract($event)"
      />
    </watt-card>
  `,
})
export class EoMeteringPointsShellComponent implements OnInit {
  private meteringPointStore = inject(EoMeteringPointsStore);
  private toastService = inject(WattToastService);
  private destroyRef = inject(DestroyRef);
  private transloco = inject(TranslocoService);

  protected isLoading$ = this.meteringPointStore.loading$;
  protected meteringPoints$ = this.meteringPointStore.meteringPoints$;
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

  onToggleContract(event: { checked: boolean; gsrn: string; type: MeteringPointType }) {
    const { checked, gsrn, type } = event;
    if (checked) {
      this.meteringPointStore.createCertificateContract(gsrn, type);
    } else {
      this.meteringPointStore.deactivateCertificateContract(gsrn, type);
    }
  }
}
