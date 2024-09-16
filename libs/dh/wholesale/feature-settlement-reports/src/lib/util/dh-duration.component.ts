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
import { Component, computed, input } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';

import { dayjs, WattRange } from '@energinet-datahub/watt/date';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-duration',
  standalone: true,
  imports: [TranslocoPipe, DhEmDashFallbackPipe],
  template: `
    @let durationView = duration();

    @if (durationView === null) {
      {{ durationView | dhEmDashFallback }}
    } @else if (durationView.days > 0) {
      {{ 'duration.days' | transloco: durationView }}
    } @else if (durationView.hours > 0) {
      {{ 'duration.hours' | transloco: durationView }}
    } @else if (durationView.minutes > 0) {
      {{ 'duration.minutes' | transloco: durationView }}
    } @else if (durationView.seconds > 0) {
      {{ 'duration.seconds' | transloco: durationView }}
    }
  `,
})
export class DhDurationComponent {
  value = input.required<WattRange<Date>>();

  duration = computed(() => {
    const { start, end } = this.value();

    if (end === null) {
      return null;
    }

    const diffInMilliseconds = dayjs(end).diff(start, 'milliseconds');
    const duration = dayjs.duration(diffInMilliseconds);

    return {
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  });
}
