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
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  MarketParticipantEicFunction,
  MarketParticipantUserRoleStatus,
} from '@energinet-datahub/dh/shared/domain';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { DhSharedUiSearchComponent } from '@energinet-datahub/dh/shared/ui-search';

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
    TranslocoModule,
    WattDropdownComponent,
    ReactiveFormsModule,
    DhSharedUiSearchComponent,
  ],
})
export class DhRolesTabListFilterComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _translocoService = inject(TranslocoService);

  @Output() statusChanged = new EventEmitter<MarketParticipantUserRoleStatus | null>();
  @Output() eicFunctionChanged = new EventEmitter<MarketParticipantEicFunction[] | null>();
  @Output() searchTermChanged = new EventEmitter<string | null>();

  statusFormControl = new FormControl<MarketParticipantUserRoleStatus | null>(null);
  eicFunctionFormControl = new FormControl<MarketParticipantEicFunction[] | null>(null);

  statusListOptions: WattDropdownOption[] = [];
  eicFunctionListListOptions: WattDropdownOption[] = [];

  ngOnInit(): void {
    this.buildStatusListOptions();
    this.buildMarketRoleListOptions();

    this.statusFormControl.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((e) => this.statusChanged.emit(e));

    this.eicFunctionFormControl.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((e) => this.eicFunctionChanged.emit(e));

    this.statusFormControl.setValue(
      this.statusListOptions[0].value as MarketParticipantUserRoleStatus
    );
  }

  search(searchTerm: string | null): void {
    this.searchTermChanged.emit(searchTerm);
  }

  private buildStatusListOptions() {
    this._translocoService
      .selectTranslateObject('admin.userManagement.roleStatus')
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (keys) => {
          this.statusListOptions = Object.keys(MarketParticipantUserRoleStatus).map((entry) => {
            return {
              value: entry,
              displayValue: keys[entry.toLowerCase()],
            };
          });
        },
      });
  }

  private buildMarketRoleListOptions() {
    this._translocoService
      .selectTranslateObject('marketParticipant.marketRoles')
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (keys) => {
          this.eicFunctionListListOptions = Object.keys(MarketParticipantEicFunction).map(
            (entry) => {
              return {
                value: entry,
                displayValue: keys[entry],
              };
            }
          );
        },
      });
  }
}
