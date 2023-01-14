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
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { WattInputModule } from '@energinet-datahub/watt/input';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import {
  WattDropdownModule,
  WattDropdownOptions,
} from '@energinet-datahub/watt/dropdown';
import {
  CreateUserRoleDto,
  EicFunction,
  UserRoleStatus,
} from '@energinet-datahub/dh/shared/domain';
import { defer, map, of, startWith, Subject, takeUntil } from 'rxjs';

interface UserRoleForm {
  name: FormControl<string>;
  description: FormControl<string>;
  eicFunction: FormControl<EicFunction>;
  roleStatus: FormControl<UserRoleStatus>;
}

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
  userRoleForm = this.fb.nonNullable.group<UserRoleForm>({
    name: this.fb.nonNullable.control('', Validators.required),
    description: this.fb.nonNullable.control('', Validators.required),
    eicFunction: this.fb.nonNullable.control(
      EicFunction.Agent,
      Validators.required
    ),
    roleStatus: this.fb.nonNullable.control(
      UserRoleStatus.Active,
      Validators.required
    ),
  });

  @Output() formReady = of(this.userRoleForm);
  @Output() eicFunctionSelected = new EventEmitter<EicFunction>();
  @Output() valueChange = defer(() =>
    this.userRoleForm.valueChanges.pipe(
      startWith(this.userRoleForm.value),
      map(
        (formValue): Partial<CreateUserRoleDto> => ({
          name: formValue.name,
          description: formValue.description,
          eicFunction: formValue.eicFunction,
          status: formValue.roleStatus,
        })
      )
    )
  );

  userRoleStatusOptions: WattDropdownOptions = [];
  eicFunctionOptions: WattDropdownOptions = [];

  private destroy$ = new Subject<void>();

  constructor(private trans: TranslocoService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildUserRoleStatusOptions();
    this.buildEicFunctionOptions();

    this.userRoleForm.controls.eicFunction.valueChanges
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
