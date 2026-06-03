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
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_CARD } from '@energinet/watt/card';
import { VATER } from '@energinet/watt/vater';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattSeparatorComponent } from '@energinet/watt/separator';
import { WattSkeletonComponent } from '@energinet/watt/skeleton';

import { combineWithIdPaths } from '@energinet-datahub/dh/core/configuration-routing';
import {
  DhEmDashFallbackPipe,
  dhMakeFormControl,
  dhMeteringPointIdValidator,
  emDash,
} from '@energinet-datahub/dh/shared/ui-util';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetMeteringPointByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';
import { uniqueContacts } from '@energinet-datahub/dh/metering-point/shared/ui-utils';

@Component({
  selector: 'dh-electrical-heating-correction',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    RouterLink,

    VATER,
    WATT_CARD,
    WattDatepickerComponent,
    WattButtonComponent,
    WattTextFieldComponent,
    WattSeparatorComponent,
    WattSkeletonComponent,
    DhEmDashFallbackPipe,
  ],
  styles: `
    :host {
      display: block;
      width: 800px;
    }

    .register-electrical-heating-title {
      color: var(--watt-color-primary);
    }

    watt-datepicker {
      width: auto;
    }

    .em-dash {
      position: relative;
      top: 12px; // Magic number
    }

    .hint {
      color: var(--watt-color-neutral-grey-700);
    }

    .no-margin {
      margin: 0;
    }
  `,
  template: `
    <form
      *transloco="let t; prefix: 'meteringPoint.electricalHeatingCorrection'"
      [formGroup]="form"
      (ngSubmit)="submit()"
    >
      <vater-stack direction="row" justify="space-between" class="watt-space-stack-ml">
        <h1 class="no-margin">{{ t('title') }}</h1>

        <watt-button [routerLink]="cancelLink()" variant="secondary"
          >{{ t('cancel') }}
        </watt-button>
      </vater-stack>

      <vater-flex gap="ml">
        <watt-card>
          <h3 class="no-margin">{{ t('title') }}</h3>
          <h2 class="no-margin register-electrical-heating-title">
            {{ t('registerElectricalHeating') }}
          </h2>
        </watt-card>

        <watt-card>
          <p class="watt-text-s-highlighted">{{ t('meteringPoint') }}</p>

          <vater-stack direction="row" gap="m" class="watt-space-stack-ml">
            <watt-separator weight="bold" orientation="vertical" />
            @if (loading()) {
              <watt-skeleton width="200px" />
            } @else {
              <div class="watt-text-s">
                {{ meteringPointId() }}
                <br />
                {{ address()?.streetName }}
                {{ address()?.buildingNumber }},

                @if (address()?.floor || address()?.room) {
                  {{ address()?.floor }} {{ address()?.room }}
                }
                <br />
                {{ address()?.postCode }} {{ address()?.cityName }}
              </div>
            }
          </vater-stack>

          <span class="watt-label">{{ t('periodTitle') }}</span>
          <vater-flex>
            <vater-stack direction="row" gap="m" align="start">
              <watt-datepicker [formControl]="form.controls.periodStart" />
              <span class="em-dash watt-text-s">{{ emDash }}</span>
              <watt-datepicker [formControl]="form.controls.periodEnd" />
            </vater-stack>

            <span class="hint watt-text-s">{{ t('periodHint') }}</span>
          </vater-flex>

          <p class="watt-text-s-highlighted">{{ t('customer') }}</p>

          <vater-stack direction="row" gap="m" class="watt-space-stack-ml">
            <watt-separator weight="bold" orientation="vertical" />
            @if (loading()) {
              <watt-skeleton width="200px" />
            } @else {
              <p class="watt-text-s">{{ firstContactName() | dhEmDashFallback }}</p>
            }
          </vater-stack>

          <vater-stack direction="row" gap="s" align="center">
            <watt-text-field
              maxLength="18"
              [formControl]="form.controls.meteringPointId"
              [label]="t('meteringPointIdLabel')"
            />
          </vater-stack>
        </watt-card>

        <watt-button type="submit">{{ t('registerElectricalHeating') }}</watt-button>
      </vater-flex>
    </form>
  `,
})
export class DhElectricalHeatingCorrection {
  private readonly actor = inject(DhActorStorage).getSelectedActor();

  meteringPointId = input.required<string>();
  searchMigratedMeteringPoints = input.required<boolean>();
  internalMeteringPointId = input.required<string>();

  private meteringPointQuery = query(GetMeteringPointByIdDocument, () => ({
    variables: {
      meteringPointId: this.meteringPointId(),
      searchMigratedMeteringPoints: this.searchMigratedMeteringPoints(),
      actorGln: this.actor.gln,
    },
  }));

  private meteringPoint = computed(() => this.meteringPointQuery.data()?.meteringPoint);

  private contacts = computed(
    () => this.meteringPoint()?.commercialRelation?.activeEnergySupplyPeriod?.customers ?? []
  );

  loading = this.meteringPointQuery.loading;

  address = computed(() => this.meteringPoint()?.metadata?.installationAddress);

  firstContactName = computed(() => {
    const [firstContact] = uniqueContacts(this.contacts());

    return firstContact?.name;
  });

  form = new FormGroup({
    meteringPointId: dhMakeFormControl<string>('', [
      Validators.required,
      dhMeteringPointIdValidator(),
    ]),
    periodStart: dhMakeFormControl<Date | null>(null, [Validators.required]),
    periodEnd: dhMakeFormControl<Date | null>(null),
  });

  emDash = emDash;

  cancelLink = computed(() =>
    combineWithIdPaths('metering-point', this.internalMeteringPointId(), 'actor-conversation')
  );

  submit() {
    console.log('submit', this.form.value);
  }
}
