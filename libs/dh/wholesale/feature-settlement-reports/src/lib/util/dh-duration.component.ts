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
