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
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { map } from 'rxjs';

import { WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { injectRelativeNavigate } from '@energinet-datahub/dh/shared/ui-util';
import { DhCalculationsCreateFormComponent } from './create-form';
import { DhCreateCalculationService } from './create-service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-calculations-create',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WATT_MODAL,
    VaterFlexComponent,
    WattButtonComponent,
    WattFieldHintComponent,
    WattTextFieldComponent,
    WattValidationMessageComponent,
    DhCalculationsCreateFormComponent,
  ],
  template: `
    <watt-modal
      #modal
      autoOpen
      size="small"
      *transloco="let t; read: 'wholesale.calculations.create'"
      [title]="confirmCalculation() ? t('warning.title.' + form.calculationType()) : t('title')"
      (closed)="navigate('..')"
    >
      <dh-calculations-create-form
        #form
        [hidden]="confirmCalculation()"
        (create)="create.mutate($event)"
        (create)="modal.close(true)"
      />

      @if (confirmCalculation()) {
        <vater-flex offset="ml" *transloco="let t; read: 'wholesale.calculations.create.warning'">
          <watt-validation-message
            type="warning"
            icon="warning"
            size="normal"
            [label]="t('message.label')"
            [message]="t('message.body.' + form.calculationType())"
          />
          <p>{{ t('body.' + form.calculationType()) }}</p>
          <p>{{ t('confirmation') }}</p>
          <watt-text-field [formControl]="confirmControl">
            <watt-field-hint>{{ t('hint.' + form.calculationType()) }}</watt-field-hint>
          </watt-text-field>
          <watt-modal-actions>
            <watt-button variant="secondary" (click)="modal.close(false)">
              {{ t('cancel') }}
            </watt-button>
            <watt-button
              [disabled]="confirmText() !== t('validation.' + form.calculationType())"
              (click)="form.submit()"
            >
              {{ t('confirm') }}
            </watt-button>
          </watt-modal-actions>
        </vater-flex>
      } @else {
        <watt-modal-actions>
          <watt-button variant="secondary" (click)="modal.close(false)">
            {{ t('cancel') }}
          </watt-button>
          <watt-button
            [disabled]="!form.valid()"
            (click)="form.existingCalculation() ? confirmCalculation.set(true) : form.submit()"
          >
            {{ t('confirm') }}
          </watt-button>
        </watt-modal-actions>
      }
    </watt-modal>
  `,
})
export class DhCalculationsCreateComponent {
  create = inject(DhCreateCalculationService);
  navigate = injectRelativeNavigate();
  confirmCalculation = signal(false);
  confirmControl = new FormControl('');
  confirmText = toSignal(this.confirmControl.valueChanges.pipe(map((v) => v?.toUpperCase())));
}
