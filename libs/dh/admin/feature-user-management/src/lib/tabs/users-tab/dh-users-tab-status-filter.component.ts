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
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { MarketParticipantUserStatus } from '@energinet-datahub/dh/shared/domain';
import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-users-tab-status-filter',
  standalone: true,
  template: `
    <ng-container *transloco="let t; read: 'admin.userManagement.tabs.users'">
      <watt-dropdown
        dhDropdownTranslator
        translate="admin.userManagement.userStatus"
        [placeholder]="t('filter.status')"
        [formControl]="statusControl"
        [options]="userStatusOptions"
        [multiple]="true"
        [chipMode]="true"
      />
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WattDropdownComponent,
    DhDropdownTranslatorDirective,
  ],
})
export class DhUsersTabStatusFilterComponent {
  statusControl = new FormControl<MarketParticipantUserStatus[]>([], { nonNullable: true });

  @Input() set initialValue(value: MarketParticipantUserStatus[]) {
    this.statusControl.setValue(value);
  }

  @Output() changed = new EventEmitter<MarketParticipantUserStatus[]>();

  userStatusOptions: WattDropdownOption[] = Object.keys(MarketParticipantUserStatus).map(
    (entry) => ({
      value: entry,
      displayValue: entry,
    })
  );

  constructor() {
    this.statusControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => this.changed.emit(value));
  }
}
