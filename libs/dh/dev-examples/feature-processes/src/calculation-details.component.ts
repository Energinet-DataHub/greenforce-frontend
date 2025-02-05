import { Component, input } from '@angular/core';
import { DhProcessCalculation } from './types';
import { WattDescriptionListItemComponent } from '@energinet-datahub/watt/description-list';
import { TranslocoDirective } from '@ngneat/transloco';
import { WattDatePipe } from '@energinet-datahub/watt/date';

@Component({
  selector: 'dh-calculation-details',
  imports: [WattDescriptionListItemComponent, TranslocoDirective, WattDatePipe],
  template: `
    @let calculation = details();
    <ng-container *transloco="let t; read: 'devExamples.calculations'">
      <watt-description-list-item
        [label]="t('details.executionType')"
        [value]="t('executionTypes.' + calculation.executionType)"
      />
      <watt-description-list-item
        [label]="t('details.period')"
        [value]="calculation.period | wattDate: 'short'"
      />
    </ng-container>
  `,
})
export class DhCalculationDetailsComponent {
  details = input.required<DhProcessCalculation>();
}
