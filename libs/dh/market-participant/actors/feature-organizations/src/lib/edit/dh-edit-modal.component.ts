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
import { Component, Input, ViewChild, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';

import { DhOrganizationDetails } from '../dh-organization';

@Component({
  standalone: true,
  selector: 'dh-organization-edit-modal',
  templateUrl: './dh-edit-modal.component.html',
  styles: [
    `
      .domain-field {
        width: 25em;
      }
    `,
  ],
  imports: [
    CommonModule,
    TranslocoDirective,

    WATT_MODAL,
    ReactiveFormsModule,
    WattButtonComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
  ],
})
export class DhOrganizationEditModalComponent implements AfterViewInit {
  @ViewChild(WattModalComponent)
  innerModal?: WattModalComponent;

  @Input() organization!: DhOrganizationDetails;

  @Output() closed = new EventEmitter<void>();

  domainControl = new FormControl('', { validators: Validators.required, nonNullable: true });

  ngAfterViewInit() {
    this.innerModal?.open();
  }

  onCloseModal() {
    this.innerModal?.close(false);

    this.closed.emit();
  }
}
