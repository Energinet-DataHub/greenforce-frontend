import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';

import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

@Component({
  selector: 'dh-tab-data-general-error',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <watt-empty-state
      icon="custom-power"
      [title]="'shared.error.title' | transloco"
      [message]="'shared.error.message' | transloco"
    >
      <watt-button (click)="reload.emit()" variant="primary">{{
        'shared.error.button' | transloco
      }}</watt-button>
    </watt-empty-state>
  `,
  imports: [TranslocoPipe, WattButtonComponent, WattEmptyStateComponent],
})
export class DhTabDataGeneralErrorComponent {
  @Output() reload = new EventEmitter<void>();
}
