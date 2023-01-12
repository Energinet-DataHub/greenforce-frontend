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
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { TranslocoModule } from '@ngneat/transloco';

import { WattCardModule } from '@energinet-datahub/watt/card';
import { UserRoleChanges } from '@energinet-datahub/dh/admin/data-access-api';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { WattInputModule } from '@energinet-datahub/watt/input';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import {
  WattDropdownModule,
  WattDropdownOptions,
} from '@energinet-datahub/watt/dropdown';
import {
  EicFunction,
  UserRoleStatus,
} from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-create-userrole-masterdata-tab',
  templateUrl: './dh-create-userrole-masterdata-tab.component.html',
  styleUrls: ['./dh-create-userrole-masterdata-tab.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslocoModule,
    WattCardModule,
    ReactiveFormsModule,
    FormsModule,
    WattInputModule,
    WattFormFieldModule,
    WattDropdownModule,
  ],
})
export class DhCreateUserroleMasterdataTabComponent {
  userRoleStatusOptions: WattDropdownOptions = [];
  userRole = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(250)]),
    description: new FormControl('', Validators.required),
    status: new FormControl(UserRoleStatus.Inactive, Validators.required),
    eicFunction: new FormControl(EicFunction.Consumer, Validators.required),
  });

  hasSubmitted = false;

  createUserRole() {
    this.hasSubmitted = true;

    if (!this.userRole.valid) return;

    //this.disableFormGroup();
    const userRole = this.userRole.value;

    // this.toastService.open({
    //   message: this.translocoService.translate(
    //     'charges.createPrices.loadingRequestText'
    //   ),
    //   type: 'loading',
    // });
  }
}
