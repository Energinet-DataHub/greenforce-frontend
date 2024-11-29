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
