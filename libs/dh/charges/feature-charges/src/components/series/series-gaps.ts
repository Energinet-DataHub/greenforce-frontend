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
  input,
  linkedSignal,
  model,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { VATER } from '@energinet/watt/vater';
import { dayjs, WattDatePipe } from '@energinet/watt/core/date';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattSpinnerComponent } from '@energinet/watt/spinner';

import {
  ChargeResolution,
  GetMissingPriceSeriesPointsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhChargesWarningBanner } from '@energinet-datahub/dh/charges/feature-ui-shared';

@Component({
  selector: 'dh-charges-series-gaps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    VATER,
    WattDatePipe,
    WattIconComponent,
    WattSpinnerComponent,
    DhChargesWarningBanner,
  ],
  styles: `
    @use '@energinet/watt/utils' as watt;

    :host {
      @include watt.typography-watt-text-s;
    }

    button {
      all: unset;
      cursor: pointer;
      text-decoration: underline;

      &:disabled {
        cursor: default;
        opacity: 0.38;
        pointer-events: none;
      }
    }

    .position {
      font-variant-numeric: tabular-nums;
    }
  `,
  template: `
    <vater-stack
      direction="row"
      align="center"
      gap="m"
      [style.height.px]="46"
      *transloco="let t; prefix: 'charges.series'"
    >
      @if (query.loading()) {
        <watt-spinner [diameter]="22" [strokeWidth]="3" />
      } @else {
        @if (gaps().length) {
          @let first = firstGap()?.toDate();
          @let next = nextGap()?.toDate();
          @let prev = prevGap()?.toDate();
          <dh-charges-warning-banner vater fill="vertical">
            @if (!navigating()) {
              {{ t('gaps.gapsFound') }}.
              <button (click)="first && date.set(first); navigating.set(true)">
                {{ t('gaps.showGaps') }}
              </button>
            } @else {
              {{ t('gaps.gapsFound') }}
              <button (click)="prev && date.set(prev)" [disabled]="!prev">
                <watt-icon size="s" name="left" />
              </button>
              <span class="position">
                {{ position() }} / {{ gaps().length }}
                {{ t('gaps.unit.' + unit()) }}
              </span>
              <button (click)="next && date.set(next)" [disabled]="!next">
                <watt-icon size="s" name="right" />
              </button>
              <button (click)="navigating.set(false)">
                <watt-icon size="s" name="close" />
              </button>
            }
          </dh-charges-warning-banner>
        }

        @if (deadlineExceeded()) {
          <dh-charges-warning-banner vater fill="vertical">
            @if (!endsAt()) {
              {{ t('gaps.noPrices') }}
            } @else {
              {{ expired() ? t('gaps.seriesExpired') : t('gaps.seriesEndsAt') }}
              {{ endsAt() | wattDate }}
            }
          </dh-charges-warning-banner>
        } @else {
          <span class="watt-on-light--medium-emphasis">
            {{ t('gaps.seriesEndsAt') }}
            {{ endsAt() | wattDate }}
          </span>
        }
      }
    </vater-stack>
  `,
})
export class DhChargesSeriesGaps {
  readonly id = input.required<string>();
  readonly resolution = input<ChargeResolution>();
  readonly date = model.required<Date>();

  query = query(GetMissingPriceSeriesPointsDocument, () => ({
    variables: {
      chargeId: this.id(),
    },
  }));

  missingPoints = computed(() => this.query.data()?.chargeById?.missingPriceSeriesPoints);
  gaps = computed(() => (this.missingPoints()?.gaps ?? []).map((g) => dayjs(g)));
  endsAt = computed(() => this.missingPoints()?.endsAt);

  deadline = dayjs().add(62, 'days');
  deadlineExceeded = computed(() => (this.endsAt() ? this.deadline.isAfter(this.endsAt()) : true));
  expired = computed(() => (this.endsAt() ? dayjs().isAfter(this.endsAt()) : true));
  unit = computed(() => {
    switch (this.resolution()) {
      case 'MONTHLY':
        return 'year';
      case 'DAILY':
        return 'month';
      default:
        return 'day';
    }
  });

  position = computed(() => this.gaps().findIndex((g) => g.isSame(this.date(), this.unit())) + 1);
  firstGap = computed(() => this.gaps().at(0));
  nextGap = computed(() => this.gaps().find((g) => g.isAfter(this.date(), this.unit())));
  prevGap = computed(() => this.gaps().findLast((g) => g.isBefore(this.date(), this.unit())));
  navigating = linkedSignal({
    source: this.position,
    computation: (pos, previous) => (pos > 0 ? (previous?.value ?? false) : false),
  });
}
