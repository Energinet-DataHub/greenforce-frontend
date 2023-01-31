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
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattDropdownModule } from '@energinet-datahub/watt/dropdown';

@Component({
  selector: 'dh-users-tab-userrole-filter',
  standalone: true,
  template: `
    <ng-container *transloco="let t; read: 'admin.userManagement.tabs.users'">
      <watt-form-field class="userrole-search-field">
        <watt-label>{{ t('filter.userrole') }}</watt-label>
        <watt-dropdown
          [placeholder]="t('searchUserRolePlaceHolder')"
          [formControl]="userRoleControl"
          [options]="userRoleOptions ?? []"
          [multiple]="true"
        ></watt-dropdown>
      </watt-form-field>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .userrole-search-field {
        width: 30rem;
      }
    `,
  ],
  imports: [
    TranslocoModule,
    ReactiveFormsModule,
    WattFormFieldModule,
    WattDropdownModule,
  ],
})
export class DhUsersTabUserRoleFilterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  userRoleControl = new FormControl<string[]>([], { nonNullable: true });

  @Input() userRoleOptions:
    | { value: string; displayValue: string }[]
    | undefined;
  @Output() changed = new EventEmitter<string[]>();

  ngOnInit(): void {
    this.userRoleControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => this.changed.emit(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
