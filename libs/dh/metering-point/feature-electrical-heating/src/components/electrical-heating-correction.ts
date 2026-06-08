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
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_CARD } from '@energinet/watt/card';
import { VATER } from '@energinet/watt/vater';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattSeparatorComponent } from '@energinet/watt/separator';
import { WattSkeletonComponent } from '@energinet/watt/skeleton';
import { WattFieldErrorComponent } from '@energinet/watt/field';
import { dayjs } from '@energinet/watt/core/date';

import { combineWithIdPaths } from '@energinet-datahub/dh/core/configuration-routing';
import {
  DhEmDashFallbackPipe,
  dhMakeFormControl,
  dhMeteringPointIdValidator,
  emDash,
  injectToast,
} from '@energinet-datahub/dh/shared/ui-util';
import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  GetConversationDocument,
  GetMeteringPointConversationInfoDocument,
  RegisterElectricalHeatingDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';

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
    WattFieldErrorComponent,
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
      top: 12px;
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

        <watt-button [routerLink]="actorConversationLink()" variant="secondary"
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
                {{ meteringPointIdFromConversation() }}
                <br />
                {{ installationAddress()?.streetName }}
                {{ installationAddress()?.buildingNumber }},
                <br />
                {{ installationAddress()?.municipalityCode }} {{ installationAddress()?.cityName }}
              </div>
            }
          </vater-stack>

          <span class="watt-label">{{ t('periodTitle') }}</span>
          <vater-flex>
            <vater-stack direction="row" gap="m" align="start">
              <watt-datepicker
                #startDatepicker
                [formControl]="form.controls.periodStart"
                [min]="periodStartMin()"
              />
              <span class="em-dash watt-text-s">{{ emDash }}</span>
              <watt-datepicker #endDatepicker [formControl]="form.controls.periodEnd" />
            </vater-stack>

            <span class="hint watt-text-s">{{ t('periodHint') }}</span>
          </vater-flex>

          <p class="watt-text-s-highlighted">{{ t('customer') }}</p>

          <vater-stack direction="row" gap="m" class="watt-space-stack-ml">
            <watt-separator weight="bold" orientation="vertical" />
            @if (loading()) {
              <watt-skeleton width="200px" />
            } @else {
              <p class="watt-text-s">{{ customerName() | dhEmDashFallback }}</p>
            }
          </vater-stack>

          <vater-stack direction="row" gap="s" align="center">
            <watt-text-field
              maxLength="18"
              [formControl]="form.controls.childMeteringPointId"
              [label]="t('childMeteringPointIdLabel')"
            >
              @if (form.controls.childMeteringPointId.hasError('meteringPointIdLength')) {
                <watt-field-error>
                  {{ t('error.meteringPointIdLength') }}
                </watt-field-error>
              }
            </watt-text-field>
          </vater-stack>
        </watt-card>

        <watt-button type="submit">{{ t('registerElectricalHeating') }}</watt-button>
      </vater-flex>
    </form>
  `,
})
export class DhElectricalHeatingCorrection {
  private readonly router = inject(Router);

  private readonly startDatepicker = viewChild<WattDatepickerComponent>('startDatepicker');
  private readonly endDatepicker = viewChild<WattDatepickerComponent>('endDatepicker');

  private registerElectricalHeating = mutation(RegisterElectricalHeatingDocument, {
    onStatusUpdated: injectToast('meteringPoint.electricalHeatingCorrection.toast'),
    onCompleted: () => this.router.navigateByUrl(this.actorConversationLink()),
  });

  conversationId = input.required<string>();

  private conversationQuery = query(GetConversationDocument, () => ({
    variables: {
      conversationId: this.conversationId(),
    },
  }));

  private conversation = computed(() => this.conversationQuery.data()?.conversation);

  meteringPointIdFromConversation = computed(
    () => this.conversation()?.meteringPointIdentification
  );

  private meteringPointConversationInfoQuery = query(
    GetMeteringPointConversationInfoDocument,
    () => {
      const meteringPointId = this.meteringPointIdFromConversation();
      return meteringPointId ? { variables: { meteringPointId } } : { skip: true };
    }
  );

  private electricalHeatingUserMessage = computed(
    () =>
      this.conversation()?.messages.find((message) => message.electricalHeatingUserMessage != null)
        ?.electricalHeatingUserMessage
  );

  installationAddress = computed(
    () => this.meteringPointConversationInfoQuery.data()?.meteringPoint.metadata.installationAddress
  );

  customerName = computed(
    () =>
      this.conversation()?.messages.find((message) => message.electricalHeatingInformation != null)
        ?.electricalHeatingInformation?.customerName
  );

  private dataHubElectricalHeatingCutOffDate = dayjs().subtract(1092, 'days').toDate();

  loading = computed(
    () => this.conversationQuery.loading() || this.meteringPointConversationInfoQuery.loading()
  );

  form = new FormGroup({
    childMeteringPointId: dhMakeFormControl<string>('', [
      Validators.required,
      dhMeteringPointIdValidator(),
    ]),
    periodStart: dhMakeFormControl<Date | null>(null, [Validators.required]),
    periodEnd: dhMakeFormControl<Date | null>(null),
  });

  periodStartMin = computed(() => {
    const electricalHeatingFrom = this.electricalHeatingUserMessage()?.electricalHeatingFrom;

    if (!electricalHeatingFrom) {
      return undefined;
    }

    if (dayjs(electricalHeatingFrom).isBefore(this.dataHubElectricalHeatingCutOffDate)) {
      return this.dataHubElectricalHeatingCutOffDate;
    }

    return dayjs(electricalHeatingFrom).toDate();
  });

  periodStartSyncEffect = effect(() => {
    const reductionPeriodFrom = this.electricalHeatingUserMessage()?.reductionPeriod.from;

    if (!reductionPeriodFrom) {
      return;
    }

    if (dayjs(reductionPeriodFrom).isBefore(this.dataHubElectricalHeatingCutOffDate)) {
      this.startDatepicker()?.selectDate(this.dataHubElectricalHeatingCutOffDate);
    } else {
      this.startDatepicker()?.selectDate(reductionPeriodFrom);
    }
  });

  periodEndSyncEffect = effect(() => {
    const reductionPeriodTo = this.electricalHeatingUserMessage()?.reductionPeriod.to;

    if (!reductionPeriodTo) {
      return;
    }

    // Do not set end date if reduction period end date is in the future.
    // This is the case if reduction period end date was not set when the "electricalHeatingUserMessage" message
    // was created in Actor conversation.
    // The default end date in that case is set to "01-01-10000".
    if (dayjs(reductionPeriodTo).isAfter(new Date())) {
      return;
    }

    this.endDatepicker()?.selectDate(reductionPeriodTo);
  });

  emDash = emDash;

  actorConversationLink = computed(() =>
    combineWithIdPaths('metering-point', this.internalMeteringPointId(), 'actor-conversation')
  );

  async submit() {
    if (this.form.invalid) {
      return;
    }

    const meteringPointIdFromConversation = this.meteringPointIdFromConversation();

    const { childMeteringPointId, periodStart, periodEnd } = this.form.getRawValue();

    assertIsDefined(meteringPointIdFromConversation);
    assertIsDefined(periodStart);

    await this.registerElectricalHeating.mutate({
      variables: {
        parentMeteringPointId: meteringPointIdFromConversation,
        childMeteringPointId,
        actorConversationId: this.conversationId(),
        periodStart,
        periodEnd,
      },
    });
  }
}
