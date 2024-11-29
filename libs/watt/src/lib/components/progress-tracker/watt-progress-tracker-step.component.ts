import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { WattIconComponent } from '../../foundations/icon/icon.component';
import { WattSpinnerComponent } from '../spinner/watt-spinner.component';

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
        @case ('canceled') {
          <watt-icon name="close" size="xs" />
        }
        @case ('failed') {
          <watt-icon name="priorityHigh" size="xs" />
        }
      }
    </div>
    <div class="watt-progress-tracker-step-text"><ng-content /></div>
  `,
})
export class WattProgressTrackerStepComponent {
  status = input.required<'pending' | 'executing' | 'completed' | 'canceled' | 'failed'>();
  label = input<string>();
  current = input(false);
  ariaCurrent = computed(() => (this.current() ? 'step' : false));
  class = computed(() => `watt-progress-tracker-step-${this.status()}`);
}
