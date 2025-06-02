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
import { Component, OnInit } from '@angular/core';
import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattButtonComponent } from '@energinet/watt/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [WATT_MODAL, WattTextFieldComponent, WattButtonComponent, ReactiveFormsModule],
  template: `
    <watt-modal #modal [title]="'Modal works'" closeLabel="Close modal">
      <watt-text-field label="Username" />
      <watt-text-field label="Password" type="password" />
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">Cancel</watt-button>
        <watt-button (click)="modal.close(true)">Save</watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class EoStartReportGenerationModalComponent extends WattTypedModal {}
