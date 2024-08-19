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
import { Component, OnInit, inject, DestroyRef, output } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattQueryParamsDirective } from '@energinet-datahub/watt/query-params';
import { EicFunction, UserRoleStatus } from '@energinet-datahub/dh/shared/domain/graphql';

export interface DhUserRolesFilters {
  status: UserRoleStatus | null;
  marketRoles: EicFunction[] | null;
}

// Map query variables type to object of form controls type
type FormControls<T> = { [P in keyof T]: FormControl<T[P] | null> };
type Filters = FormControls<DhUserRolesFilters>;

@Component({
  selector: 'dh-roles-overview-list-filter',
  standalone: true,
  templateUrl: './dh-roles-overview-list-filter.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    VaterStackComponent,
    WattDropdownComponent,
    WattQueryParamsDirective,

    DhDropdownTranslatorDirective,
  ],
})
export class DhRolesOverviewListFilterComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  formGroup = new FormGroup<Filters>({
    status: dhMakeFormControl(UserRoleStatus.Active),
    marketRoles: dhMakeFormControl([]),
  });

  statusOptions: WattDropdownOption[] = dhEnumToWattDropdownOptions(UserRoleStatus);
  marketRolesOptions: WattDropdownOption[] = dhEnumToWattDropdownOptions(EicFunction);

  statusChanged = output<UserRoleStatus | null>();
  eicFunctionChanged = output<EicFunction[] | null>();

  ngOnInit(): void {
    this.formGroup.controls.status.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.statusChanged.emit(value));

    this.formGroup.controls.marketRoles.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.eicFunctionChanged.emit(value));
  }
}
