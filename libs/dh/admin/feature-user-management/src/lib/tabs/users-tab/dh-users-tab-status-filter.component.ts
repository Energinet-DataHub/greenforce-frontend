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
import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { MarketParticipantUserStatus } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-users-tab-status-filter',
  standalone: true,
  template: `
    <ng-container *transloco="let t; read: 'admin.userManagement.tabs.users'">
      <watt-dropdown
        [label]="t('filter.status')"
        [formControl]="statusControl"
        [options]="userStatusOptions"
        [multiple]="true"
      />
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      watt-dropdown {
        width: 15rem;
      }
    `,
  ],
  imports: [TranslocoModule, ReactiveFormsModule, WattDropdownComponent],
})
export class DhUsersTabStatusFilterComponent implements OnInit {
  private trans = inject(TranslocoService);
  private _destroyRef = inject(DestroyRef);

  statusControl = new FormControl<MarketParticipantUserStatus[]>([], { nonNullable: true });

  @Input() set initialValue(value: MarketParticipantUserStatus[]) {
    this.statusControl.setValue(value);
  }

  @Output() changed = new EventEmitter<MarketParticipantUserStatus[]>();

  userStatusOptions: WattDropdownOption[] = [];

  ngOnInit(): void {
    this.buildUserStatusOptions();
    this.statusControl.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => this.changed.emit(value));
  }

  private buildUserStatusOptions() {
    this.trans
      .selectTranslateObject('admin.userManagement.userStatus')
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (keys) => {
          this.userStatusOptions = Object.keys(MarketParticipantUserStatus).map((entry) => {
            return {
              value: entry,
              displayValue: keys[entry],
            };
          });
        },
      });
  }
}
