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
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, effect, output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { map, startWith } from 'rxjs';
import { TranslocoDirective } from '@ngneat/transloco';

import {
  EicFunction,
  UserRoleStatus,
  GetFilteredUserRolesQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import {
  dhMakeFormControl,
  dhEnumToWattDropdownOptions,
  DhDropdownTranslatorDirective,
} from '@energinet-datahub/dh/shared/ui-util';

import { exists } from '@energinet-datahub/dh/shared/util-operators';

import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattQueryParamsDirective } from '@energinet-datahub/watt/directives';

@Component({
  standalone: true,
  selector: 'dh-user-roles-filter',
  imports: [
    FormsModule,
    TranslocoDirective,
    ReactiveFormsModule,

    WattDropdownComponent,
    WattQueryParamsDirective,

    VaterStackComponent,

    DhPermissionRequiredDirective,
    DhDropdownTranslatorDirective,
  ],
  template: `<form
    vater-stack
    direction="row"
    gap="s"
    tabindex="-1"
    [formGroup]="form"
    wattQueryParams
    *transloco="let t; read: 'admin.userManagement.tabs.roles.filter'"
  >
    <watt-dropdown
      dhDropdownTranslator
      translateKey="admin.userManagement.roleStatus"
      [placeholder]="t('status')"
      [formControl]="form.controls.status"
      [options]="statusOptions"
      [chipMode]="true"
    />

    <watt-dropdown
      *dhPermissionRequired="['fas']"
      dhDropdownTranslator
      translateKey="marketParticipant.marketRoles"
      [placeholder]="t('marketRole')"
      [formControl]="form.controls.marketRoles"
      [options]="marketRolesOptions"
      [multiple]="true"
      [chipMode]="true"
    />
  </form>`,
})
export class DhUserRolesFilterComponent {
  form = new FormGroup({
    status: dhMakeFormControl(UserRoleStatus.Active),
    marketRoles: dhMakeFormControl([]),
  });

  statusOptions = dhEnumToWattDropdownOptions(UserRoleStatus);
  marketRolesOptions = dhEnumToWattDropdownOptions(EicFunction);

  filter = output<GetFilteredUserRolesQueryVariables>();

  values = toSignal<GetFilteredUserRolesQueryVariables>(
    this.form.valueChanges.pipe(
      startWith(null),
      map(() => this.form.getRawValue()),
      exists(),
      map(({ marketRoles, status }) => ({
        eicFunctions: marketRoles,
        status: status,
      }))
    ),
    { requireSync: true }
  );

  constructor() {
    effect(() => {
      this.filter.emit(this.values());
    });
  }
}
