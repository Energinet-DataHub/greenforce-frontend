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
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';

@Component({
  selector: 'dh-users-tab-userrole-filter',
  standalone: true,
  template: `
    <ng-container *transloco="let t; read: 'admin.userManagement.tabs.users'">
      <watt-dropdown
        [placeholder]="t('searchUserRolePlaceHolder')"
        [formControl]="userRoleControl"
        [options]="userRoleOptions"
        [label]="t('filter.userrole')"
        [multiple]="true"
      ></watt-dropdown>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;

        watt-dropdown {
          width: 15rem;
        }
      }
    `,
  ],
  imports: [TranslocoModule, ReactiveFormsModule, WATT_FORM_FIELD, WattDropdownComponent],
})
export class DhUsersTabUserRoleFilterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  userRoleControl = new FormControl<string[]>([], { nonNullable: true });

  @Input() userRoleOptions: { value: string; displayValue: string }[];
  @Output() changed = new EventEmitter<string[]>();

  constructor() {
    this.userRoleOptions = [];
  }

  ngOnInit(): void {
    this.userRoleControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => this.changed.emit(value || []));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
