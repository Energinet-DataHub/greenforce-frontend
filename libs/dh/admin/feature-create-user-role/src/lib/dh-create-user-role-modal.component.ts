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
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RxPush } from '@rx-angular/template/push';
import { RxLet } from '@rx-angular/template/let';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { provideComponentStore } from '@ngrx/component-store';

import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattTextAreaFieldComponent } from '@energinet-datahub/watt/textarea-field';

import {
  MarketParticipantCreateUserRoleDto,
  MarketParticipantEicFunction,
  MarketParticipantPermissionDetailsDto,
  MarketParticipantUserRoleStatus,
} from '@energinet-datahub/dh/shared/domain';
import { DhPermissionsTableComponent } from '@energinet-datahub/dh/admin/ui-permissions-table';
import {
  DhAdminCreateUserRoleManagementDataAccessApiStore,
  DhAdminMarketRolePermissionsStore,
} from '@energinet-datahub/dh/admin/data-access-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface UserRoleForm {
  eicFunction: FormControl<MarketParticipantEicFunction>;
  name: FormControl<string>;
  description: FormControl<string>;
  status: FormControl<MarketParticipantUserRoleStatus>;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-create-user-role-modal',
  templateUrl: './dh-create-user-role-modal.component.html',
  styleUrls: ['./dh-create-user-role-modal.component.scss'],
  standalone: true,
  providers: [
    provideComponentStore(DhAdminCreateUserRoleManagementDataAccessApiStore),
    provideComponentStore(DhAdminMarketRolePermissionsStore),
  ],
  imports: [
    NgIf,
    WATT_MODAL,
    WattButtonComponent,
    TranslocoModule,
    WattIconComponent,
    ReactiveFormsModule,
    WattDropdownComponent,
    WattFieldErrorComponent,
    WattTextFieldComponent,
    WattTextAreaFieldComponent,
    RxPush,
    RxLet,
    WATT_STEPPER,
    WattEmptyStateComponent,
    DhPermissionsTableComponent,
  ],
})
export class DhCreateUserRoleModalComponent implements OnInit, AfterViewInit {
  private formBuilder = inject(FormBuilder);
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private destroyRef = inject(DestroyRef);

  private readonly marketRolePermissionsStore = inject(DhAdminMarketRolePermissionsStore);
  private readonly createUserRoleStore = inject(DhAdminCreateUserRoleManagementDataAccessApiStore);

  @ViewChild('createUserRoleModal') createUserRoleModal!: WattModalComponent;

  @Output() closed = new EventEmitter<{ saveSuccess: boolean }>();

  permissions$ = this.marketRolePermissionsStore.permissions$;

  isSubmitted = false;

  userRoleForm = this.formBuilder.nonNullable.group<UserRoleForm>({
    eicFunction: this.formBuilder.nonNullable.control(
      MarketParticipantEicFunction.BalanceResponsibleParty,
      Validators.required
    ),
    name: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(250),
    ]),
    description: this.formBuilder.nonNullable.control('', Validators.required),
    status: this.formBuilder.nonNullable.control(MarketParticipantUserRoleStatus.Active),
  });

  selectedPermissions = new FormControl<number[]>([], {
    validators: Validators.required,
    nonNullable: true,
  });

  eicFunctionOptions: WattDropdownOptions = [];

  ngOnInit(): void {
    this.buildEicFunctionOptions();

    this.userRoleForm.controls.eicFunction.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.marketRolePermissionsStore.getPermissions(value);
      });

    this.marketRolePermissionsStore.getPermissions(this.userRoleForm.controls.eicFunction.value);
  }

  ngAfterViewInit(): void {
    this.createUserRoleModal.open();
  }

  onSelectionChange(event: MarketParticipantPermissionDetailsDto[]): void {
    const ids = event.map(({ id }) => id);

    this.selectedPermissions.setValue(ids);
    this.selectedPermissions.markAsTouched();
  }

  closeModal(saveSuccess: boolean) {
    this.createUserRoleModal.close(saveSuccess);
    this.closed.emit({ saveSuccess });
  }

  createUserRole(): void {
    this.isSubmitted = true;

    if (this.selectedPermissions.invalid) {
      return;
    }

    const createUserRoleDto: MarketParticipantCreateUserRoleDto = {
      ...this.userRoleForm.getRawValue(),
      permissions: this.selectedPermissions.value,
    };

    this.createUserRoleStore.createUserRole({
      createUserRoleDto,
      onSuccessFn: this.onSuccesFn,
      onErrorFn: this.onErrorFn,
    });

    this.toastService.open({
      message: this.transloco.translate('admin.userManagement.createrole.createRoleRequest.start'),
      type: 'loading',
    });
  }

  private readonly onSuccesFn = () => {
    const message = this.transloco.translate(
      'admin.userManagement.createrole.createRoleRequest.success'
    );

    this.toastService.open({ type: 'success', message });
    this.closeModal(true);
  };

  private readonly onErrorFn = () => {
    const message = this.transloco.translate(
      'admin.userManagement.createrole.createRoleRequest.error'
    );

    this.toastService.open({ message, type: 'danger' });
  };

  private buildEicFunctionOptions() {
    this.transloco
      .selectTranslateObject('marketParticipant.marketRoles')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (keys) => {
          this.eicFunctionOptions = Object.keys(MarketParticipantEicFunction)
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
