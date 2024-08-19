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
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

@Component({
  imports: [WattIconComponent, WattSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  selector: 'watt-progress-tracker-step',
  host: {
    '[attr.role]': 'current() ? "status" : "presentation"',
    '[attr.class]': 'class()',
    '[attr.aria-current]': 'ariaCurrent()',
    '[attr.aria-label]': 'label()',
  },
  styleUrl: './watt-progress-tracker-step.component.scss',
  template: `
    <div class="watt-progress-tracker-step-icon">
      @switch (status()) {
        @case ('executing') {
          <watt-spinner [diameter]="26" [strokeWidth]="2" />
        }
        @case ('completed') {
          <watt-icon name="checkmark" size="xs" />
        }
        @case ('failed') {
          <watt-icon name="close" size="xs" />
        }
      }
    </div>
    <div class="watt-progress-tracker-step-text"><ng-content /></div>
  `,
})
export class WattProgressTrackerStepComponent {
  status = input.required<'pending' | 'executing' | 'completed' | 'failed'>();
  label = input<string>();
  current = input(false);
  ariaCurrent = computed(() => (this.current() ? 'step' : false));
  class = computed(() => `watt-progress-tracker-step-${this.status()}`);
}
