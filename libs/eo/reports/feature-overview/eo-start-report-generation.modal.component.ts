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
import { Component } from '@angular/core';
import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet/watt/button';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { translations } from '@energinet-datahub/eo/translations';
import { WattDatepickerComponent } from '@energinet/watt/picker/datepicker';
import { dayjs } from '../../../watt/package/core/date/dayjs';

@Component({
  imports: [
    WATT_MODAL,
    WattButtonComponent,
    ReactiveFormsModule,
    TranslocoPipe,
    WattDatepickerComponent,
  ],
  styles: [
    `
      .modal-content-margin {
        margin-top: var(--watt-space-m);
      }

      .disclaimer {
        margin-bottom: var(--watt-space-m);
        font-weight: normal;
      }
    `,
  ],
  template: `
    <watt-modal
      #modal
      [title]="translations.reports.overview.modal.title | transloco"
      closeLabel="Close modal"
    >
      <div class="modal-content-margin">
        <h6 class="disclaimer">{{ translations.reports.overview.modal.disclaimer | transloco }}</h6>
        <watt-datepicker
          [formControl]="startDateControl"
          label="{{ translations.reports.overview.modal.startDateLabel | transloco }}"
        />
        <watt-datepicker
          [formControl]="endDateControl"
          [max]="maxEndDate"
          label="{{ translations.reports.overview.modal.endDateLabel | transloco }}"
        />
      </div>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)"
          >{{ translations.reports.overview.modal.cancel | transloco }}
        </watt-button>
        <watt-button
          (click)="modal.close(true)"
          [disabled]="startDateControl.invalid || endDateControl.invalid"
          >{{ translations.reports.overview.modal.start | transloco }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class EoStartReportGenerationModalComponent extends WattTypedModal {
  public startDateControl = new FormControl(dayjs().subtract(1, 'year').toDate(), [
    Validators.required,
  ]);
  public endDateControl = new FormControl(dayjs().toDate(), [Validators.required]);

  protected translations = translations;
  maxEndDate = dayjs().toDate();
}
