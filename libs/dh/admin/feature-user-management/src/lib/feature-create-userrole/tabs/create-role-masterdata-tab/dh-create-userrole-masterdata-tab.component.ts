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
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { WattCardModule } from '@energinet-datahub/watt/card';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { WattInputModule } from '@energinet-datahub/watt/input';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import {
  WattDropdownModule,
  WattDropdownOptions,
} from '@energinet-datahub/watt/dropdown';
import {
  EicFunction,
  UserRoleStatus,
} from '@energinet-datahub/dh/shared/domain';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'dh-create-userrole-masterdata-tab',
  templateUrl: './dh-create-userrole-masterdata-tab.component.html',
  styleUrls: ['./dh-create-userrole-masterdata-tab.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslocoModule,
    WattCardModule,
    ReactiveFormsModule,
    FormsModule,
    WattInputModule,
    WattFormFieldModule,
    WattDropdownModule,
  ],
})
export class DhCreateUserroleMasterdataTabComponent
  implements OnInit, OnDestroy
{
  @Output() eicFunctionSelected = new EventEmitter<EicFunction>();

  userRoleStatusOptions: WattDropdownOptions = [];
  eicFunctionOptions: WattDropdownOptions = [];
  eicFunctionControl = new FormControl<EicFunction>(EicFunction.Consumer, {
    validators: [Validators.required],
    nonNullable: true,
  });
  userRole = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(250)]),
    description: new FormControl('', Validators.required),
    roleStatus: new FormControl<UserRoleStatus>(
      UserRoleStatus.Inactive,
      Validators.required
    ),
    eicFunction: this.eicFunctionControl,
  });

  private destroy$ = new Subject<void>();

  constructor(private trans: TranslocoService) {}

  ngOnInit(): void {
    this.buildUserRoleStatusOptions();
    this.buildEicFunctionOptions();
    this.eicFunctionControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => this.eicFunctionSelected.emit(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildUserRoleStatusOptions() {
    this.trans
      .selectTranslateObject('admin.userManagement.roleStatus')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (keys) => {
          this.userRoleStatusOptions = Object.keys(UserRoleStatus)
            .map((entry) => {
              return {
                value: entry,
                displayValue: keys[entry.toLowerCase()],
              };
            })
            .sort((a, b) => a.displayValue.localeCompare(b.displayValue));
        },
      });
  }

  private buildEicFunctionOptions() {
    this.trans
      .selectTranslateObject('marketParticipant.marketRoles')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (keys) => {
          this.eicFunctionOptions = Object.keys(EicFunction)
            .map((entry) => {
              return {
                value: entry,
                displayValue: keys[entry],
              };
            })
            .sort((a, b) => a.displayValue.localeCompare(b.displayValue));
        },
      });
  }
}
