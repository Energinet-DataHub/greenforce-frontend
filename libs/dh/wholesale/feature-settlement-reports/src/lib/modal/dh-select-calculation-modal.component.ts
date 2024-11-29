import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { KeyValuePairOfStringAndListOfRequestSettlementReportGridAreaCalculation } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-select-calculation-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    VaterStackComponent,
    WATT_MODAL,
    WattDatePipe,
    WattRadioComponent,
    WattButtonComponent,
  ],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <watt-modal
      *transloco="let t; read: 'wholesale.settlementReports.selectCalculationModal'"
      [title]="t('title')"
      #modal
    >
      <p>{{ t('description') }}</p>

      <form
        id="select-calculation-form"
        [formGroup]="modalData.formGroup"
        (ngSubmit)="modal.close(true)"
      >
        @for (group of modalData.rawData; track group) {
          @if (group.value.length > 1) {
            <vater-stack align="flex-start" gap="s" class="watt-space-stack-l">
              <span class="watt-label">{{ group.value[0].gridAreaWithName?.displayName }}</span>

              @for (calculation of group.value; track calculation; let first = $first) {
                <watt-radio
                  [group]="group.key"
                  [formControlName]="group.key"
                  [value]="calculation.calculationId"
                >
                  {{ calculation.calculationDate | wattDate: 'long' }}

                  @if (first) {
                    ({{ t('latest') }})
                  }
                </watt-radio>
              }
            </vater-stack>
          }
        }
      </form>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('cancel') }}
        </watt-button>

        <watt-button type="submit" formId="select-calculation-form">
          {{ t('confirm') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhSelectCalculationModalComponent extends WattTypedModal<{
  rawData: KeyValuePairOfStringAndListOfRequestSettlementReportGridAreaCalculation[];
  formGroup: FormGroup<{
    [gridAreaCode: string]: FormControl<string>;
  }>;
}> {}
