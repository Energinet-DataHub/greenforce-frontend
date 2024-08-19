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
  DestroyRef,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattQueryParamsDirective } from '@energinet-datahub/watt/query-params';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';

import { UserStatus } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhUserManagementFilters } from '@energinet-datahub/dh/admin/data-access-api';

// Map query variables type to object of form controls type
type FormControls<T> = { [P in keyof T]: FormControl<T[P] | null> };
type Filters = FormControls<DhUserManagementFilters>;

@Component({
  standalone: true,
  selector: 'dh-users-overview-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    VaterStackComponent,
    WattDropdownComponent,
    WattQueryParamsDirective,

    DhDropdownTranslatorDirective,
  ],
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <form
      vater-stack
      direction="row"
      gap="s"
      tabindex="-1"
      [formGroup]="formGroup"
      wattQueryParams
      *transloco="let t; read: 'admin.userManagement.tabs.users.filter'"
    >
      <watt-dropdown
        dhDropdownTranslator
        [formControl]="formGroup.controls.status"
        translateKey="admin.userManagement.userStatus"
        [placeholder]="t('status')"
        [options]="userStatusOptions"
        [multiple]="true"
        [chipMode]="true"
      />

      @if (canChooseMultipleActors()) {
        <watt-dropdown
          [placeholder]="t('marketPartyPlaceholder')"
          [formControl]="formGroup.controls.actorId"
          [options]="actorOptions()"
          [multiple]="false"
          [chipMode]="true"
        />
      }

      <watt-dropdown
        [placeholder]="t('userRolePlaceholder')"
        [formControl]="formGroup.controls.userRoleIds"
        [options]="userRoleOptions()"
        [multiple]="true"
        [chipMode]="true"
      />
    </form>
  `,
})
export class DhUsersOverviewFiltersComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  formGroup!: FormGroup<Filters>;

  userStatusOptions = dhEnumToWattDropdownOptions(UserStatus);

  statusValue = input.required<UserStatus[] | null>();
  canChooseMultipleActors = input.required<boolean>();

  actorOptions = input.required<WattDropdownOptions>();
  userRoleOptions = input.required<WattDropdownOptions>();

  filtersChanges = output<DhUserManagementFilters>();

  ngOnInit(): void {
    this.formGroup = new FormGroup<Filters>({
      status: dhMakeFormControl(this.statusValue()),
      actorId: dhMakeFormControl(),
      userRoleIds: dhMakeFormControl(),
    });

    this.formGroup.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.filtersChanges.emit(value as DhUserManagementFilters));
  }
}
