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

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';

import { EoMeteringPointsStore } from '@energinet-datahub/eo/metering-points/data-access-api';

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
      label="You have the option to switch your metering points ON and OFF."
      size="normal"
      icon="info"
      [autoScrollIntoView]="false"
    >
      <p>For Production metering points:</p>

      <ul>
        <li>Turning it 'ON' means the metering point is actively issuing certificates of power.</li>
        <li>Switching it 'OFF' will stop the metering point from issuing certificates.</li>
      </ul>

      <br />
      <p>For Consumption metering points:</p>

      <ul>
        <li>
          'ON' indicates that the Consumption metering point actively issues consumption
          certificates.
        </li>
        <li>
          'OFF' indicates that the Consumption metering point will source its electricity from
          elsewhere.
        </li>
      </ul>
    </watt-validation-message>
    <watt-card>
      <watt-card-title>
        <h3 class="watt-on-light--high-emphasis">Results</h3>
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

  isLoading$ = this.meteringPointStore.loading$;
  meteringPoints$ = this.meteringPointStore.meteringPoints$;
  contractError$ = this.meteringPointStore.contractError$;
  meteringPointError$ = this.meteringPointStore.meteringPointError$;

  ngOnInit(): void {
    this.meteringPointStore.loadMeteringPoints();

    this.contractError$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((error) => {
      if (error) {
        this.toastService.open({
          message: 'Issue encountered. Please try again or reload the page.',
          type: 'danger',
        });
      }
    });
  }

  onToggleContract(event: { checked: boolean; gsrn: string }) {
    const { checked, gsrn } = event;
    if (checked) {
      this.meteringPointStore.createCertificateContract(gsrn);
    } else {
      this.meteringPointStore.deactivateCertificateContract(gsrn);
    }
  }
}
