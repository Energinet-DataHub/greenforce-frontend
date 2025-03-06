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
import {
  effect,
  inject,
  output,
  computed,
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  NonNullableFormBuilder,
} from '@angular/forms';

import { toSignal } from '@angular/core/rxjs-interop';

import { map, startWith } from 'rxjs';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { translate, TranslocoDirective } from '@ngneat/transloco';

import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattQueryParamsDirective } from '@energinet-datahub/watt/query-params';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

import {
  dhEnumToWattDropdownOptions,
  DhDropdownTranslatorDirective,
} from '@energinet-datahub/dh/shared/ui-util';

import {
  UserStatus,
  GetUserRolesDocument,
  GetUsersQueryVariables,
  GetFilteredActorsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { exists } from '@energinet-datahub/dh/shared/util-operators';

@Component({
  selector: 'dh-users-overview-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    TranslocoDirective,
    ReactiveFormsModule,
    VaterStackComponent,
    WattDropdownComponent,
    WattQueryParamsDirective,
    DhDropdownTranslatorDirective,
  ],
  template: `
    <form
      vater-stack
      direction="row"
      gap="s"
      [formGroup]="form"
      tabindex="-1"
      wattQueryParams
      *transloco="let t; read: 'admin.userManagement.tabs.users.filter'"
    >
      <watt-dropdown
        dhDropdownTranslator
        [formControl]="form.controls.status"
        translateKey="admin.userManagement.userStatus"
        [placeholder]="t('status')"
        [options]="userStatusOptions"
        [multiple]="true"
        [chipMode]="true"
      />

      @if (canChooseMultipleActors()) {
        <watt-dropdown
          [placeholder]="t('marketPartyPlaceholder')"
          [options]="actorOptions()"
          [formControl]="form.controls.actorId"
          [multiple]="false"
          [chipMode]="true"
        />
      }

      <watt-dropdown
        [placeholder]="t('userRolePlaceholder')"
        [options]="userRoleOptions()"
        [formControl]="form.controls.userRoleIds"
        [multiple]="true"
        [chipMode]="true"
      />
    </form>
  `,
})
export class DhUsersOverviewFiltersComponent {
  private fb = inject(NonNullableFormBuilder);
  private actors = query(GetFilteredActorsDocument);
  private userRoles = query(GetUserRolesDocument);

  form = this.fb.group({
    status: new FormControl<UserStatus[]>([
      UserStatus.Active,
      UserStatus.Invited,
      UserStatus.InviteExpired,
    ]),
    actorId: new FormControl<string | null>(null),
    userRoleIds: new FormControl<string[] | null>(null),
  });

  actorOptions = computed<WattDropdownOptions>(() =>
    (this.actors.data()?.filteredActors ?? []).map((actor) => ({
      displayValue:
        actor.name + ' (' + translate(`marketParticipant.marketRoles.${actor.marketRole}`) + ')',
      value: actor.id,
    }))
  );

  userStatusOptions = dhEnumToWattDropdownOptions(UserStatus);
  canChooseMultipleActors = computed(() => this.actorOptions().length > 1);

  userRoleOptions = computed<WattDropdownOptions>(() =>
    (this.userRoles.data()?.userRoles ?? []).map((userRole) => ({
      displayValue:
        userRole.name +
        ' (' +
        translate(`marketParticipant.marketRoles.${userRole.eicFunction}`) +
        ')',
      value: userRole.id,
    }))
  );

  filter = output<GetUsersQueryVariables>();

  values = toSignal<GetUsersQueryVariables>(
    this.form.valueChanges.pipe(
      startWith(null),
      map(() => this.form.getRawValue()),
      exists(),
      map(({ actorId, status, userRoleIds }) => ({
        actorId,
        userStatus: status,
        userRoleIds,
      }))
    ),
    { requireSync: true }
  );

  actorId = toSignal<string | null>(this.form.controls.actorId.valueChanges);

  constructor() {
    effect(() => this.filter.emit(this.values()));
    effect(() => this.userRoles.refetch({ actorId: this.actorId() }));
  }
}
