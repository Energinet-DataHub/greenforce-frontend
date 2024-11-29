import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { provideComponentStore } from '@ngrx/component-store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattTextAreaFieldComponent } from '@energinet-datahub/watt/textarea-field';
import { DhCreateUserRoleStore } from '@energinet-datahub/dh/admin/data-access-api';
import { DhPermissionsTableComponent } from '@energinet-datahub/dh/admin/shared';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  CreateUserRoleDtoInput,
  EicFunction,
  GetPermissionByEicFunctionDocument,
  PermissionDetailsDto,
  UserRoleStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';

interface UserRoleForm {
  eicFunction: FormControl<EicFunction>;
  name: FormControl<string>;
  description: FormControl<string>;
  status: FormControl<UserRoleStatus>;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-create-user-role-modal',
  templateUrl: './dh-create-user-role-modal.component.html',
  styleUrls: ['./dh-create-user-role-modal.component.scss'],
  standalone: true,
  providers: [provideComponentStore(DhCreateUserRoleStore)],
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    WATT_MODAL,
    WattButtonComponent,
    WattIconComponent,
    WattDropdownComponent,
    WattFieldErrorComponent,
    WattTextFieldComponent,
    WattTextAreaFieldComponent,
    WATT_STEPPER,
    WattEmptyStateComponent,

    DhPermissionsTableComponent,
    DhDropdownTranslatorDirective,
  ],
})
export class DhCreateUserRoleModalComponent implements OnInit, AfterViewInit {
  private formBuilder = inject(FormBuilder);
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private destroyRef = inject(DestroyRef);

  private readonly createUserRoleStore = inject(DhCreateUserRoleStore);

  createUserRoleModal = viewChild.required(WattModalComponent);

  closed = output();

  initialEicFunction = EicFunction.BalanceResponsibleParty;

  permissionsQuery = query(GetPermissionByEicFunctionDocument, {
    variables: { eicFunction: this.initialEicFunction },
  });

  loading = this.permissionsQuery.loading;

  hasError = this.permissionsQuery.hasError;

  permissions = computed(() => this.permissionsQuery.data()?.permissionsByEicFunction ?? []);

  isSubmitted = false;

  userRoleForm = this.formBuilder.nonNullable.group<UserRoleForm>({
    eicFunction: this.formBuilder.nonNullable.control(this.initialEicFunction, Validators.required),
    name: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(250),
    ]),
    description: this.formBuilder.nonNullable.control('', Validators.required),
    status: this.formBuilder.nonNullable.control(UserRoleStatus.Active),
  });

  selectedPermissions = new FormControl<number[]>([], {
    validators: Validators.required,
    nonNullable: true,
  });

  eicFunctionOptions = dhEnumToWattDropdownOptions(EicFunction);

  ngOnInit(): void {
    this.userRoleForm.controls.eicFunction.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.permissionsQuery.refetch({ eicFunction: value });
      });
  }

  ngAfterViewInit(): void {
    this.createUserRoleModal().open();
  }

  onSelectionChange(event: PermissionDetailsDto[]): void {
    const ids = event.map(({ id }) => id);

    this.selectedPermissions.setValue(ids);
    this.selectedPermissions.markAsTouched();
  }

  closeModal(saveSuccess: boolean) {
    this.createUserRoleModal().close(saveSuccess);
    this.closed.emit();
  }

  createUserRole(): void {
    this.isSubmitted = true;

    if (this.selectedPermissions.invalid) {
      return;
    }

    const createUserRoleDto: CreateUserRoleDtoInput = {
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
}
