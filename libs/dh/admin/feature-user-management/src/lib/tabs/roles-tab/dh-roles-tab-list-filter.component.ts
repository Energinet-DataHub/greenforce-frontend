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
import { Component, OnInit, Output, EventEmitter, inject, DestroyRef } from '@angular/core';
import { RxPush } from '@rx-angular/template/push';
import { RxLet } from '@rx-angular/template/let';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  MarketParticipantEicFunction,
  MarketParticipantUserRoleStatus,
} from '@energinet-datahub/dh/shared/domain';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-roles-tab-list-filter',
  standalone: true,
  templateUrl: './dh-roles-tab-list-filter.component.html',
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        gap: var(--watt-space-m);
      }
    `,
  ],
  imports: [
    RxLet,
    RxPush,
    TranslocoDirective,
    ReactiveFormsModule,

    WattDropdownComponent,
    DhDropdownTranslatorDirective,
  ],
})
export class DhRolesTabListFilterComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _translocoService = inject(TranslocoService);

  @Output() statusChanged = new EventEmitter<MarketParticipantUserRoleStatus | null>();
  @Output() eicFunctionChanged = new EventEmitter<MarketParticipantEicFunction[] | null>();

  statusControl = new FormControl<MarketParticipantUserRoleStatus | null>(null);
  marketRolesControl = new FormControl<MarketParticipantEicFunction[] | null>(null);

  statusOptions: WattDropdownOption[] = [];
  marketRolesOptions: WattDropdownOption[] = Object.keys(MarketParticipantEicFunction).map(
    (entry) => ({
      value: entry,
      displayValue: entry,
    })
  );

  ngOnInit(): void {
    this.buildStatusListOptions();

    this.statusControl.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((e) => this.statusChanged.emit(e));

    this.marketRolesControl.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((e) => this.eicFunctionChanged.emit(e));

    this.statusControl.setValue(this.statusOptions[0].value as MarketParticipantUserRoleStatus);
  }

  private buildStatusListOptions() {
    this._translocoService
      .selectTranslateObject('admin.userManagement.roleStatus')
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (keys) => {
          this.statusOptions = Object.keys(MarketParticipantUserRoleStatus).map((entry) => {
            return {
              value: entry,
              displayValue: keys[entry.toLowerCase()],
            };
          });
        },
      });
  }
}
