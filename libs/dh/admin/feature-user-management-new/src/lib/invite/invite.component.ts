import {
  effect,
  inject,
  signal,
  computed,
  Component,
  viewChild,
  ChangeDetectorRef,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';

import { translate, TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

import { UserRoleItem } from '@energinet-datahub/dh/admin/data-access-api';
import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { parseGraphQLErrorResponse } from '@energinet-datahub/dh/shared/data-access-graphql';

import {
  GetUsersDocument,
  InviteUserDocument,
  GetKnownEmailsDocument,
  GetFilteredActorsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  ApiErrorCollection,
  readApiErrorResponse,
} from '@energinet-datahub/dh/market-participant/data-access-api';

import { DhAssignableUserRolesComponent } from './assignable-user-roles.component';
import { validateIfAlreadyAssociatedToActor, validateIfDomainExists } from './invite.validators';
import { GraphQLErrors } from '@apollo/client/errors';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'dh-invite-user',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
  standalone: true,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WATT_STEPPER,
    WattIconComponent,
    WattDropdownComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    WattPhoneFieldComponent,
    WattValidationMessageComponent,

    DhAssignableUserRolesComponent,
  ],
})
export class DhInviteUserComponent {
  private toastService = inject(WattToastService);
  private changeDectorRef = inject(ChangeDetectorRef);
  private translocoService = inject(TranslocoService);
  private nonNullableFormBuilder = inject(NonNullableFormBuilder);

  modal = viewChild.required(WattModalComponent);

  inviteUserMutation = mutation(InviteUserDocument, {
    refetchQueries: [GetUsersDocument],
  });

  isInvitingUser = this.inviteUserMutation.loading;

  actorsQuery = query(GetFilteredActorsDocument);

  actors = computed(() => this.actorsQuery.data()?.filteredActors ?? []);

  actorOptions = computed<WattDropdownOptions>(() =>
    this.actors().map((actor) => ({
      displayValue:
        actor.name + ' (' + translate(`marketParticipant.marketRoles.${actor.marketRole}`) + ')',
      value: actor.id,
    }))
  );

  domains = computed(
    () => this.actors().find((x) => x.id === this.selectedActorId())?.organization.domains
  );

  inOrganizationMailDomain = computed(() => {
    const email = this.emailChanged();
    const domains = this.domains();

    return (
      !!email &&
      !!domains &&
      domains.some((domain) => email.toUpperCase().endsWith(domain.toUpperCase()))
    );
  });

  emailExists = computed(() => {
    const email = this.emailChanged();
    return !!email && this.knownEmails().includes(email.toUpperCase());
  });

  knownEmailsQuery = query(GetKnownEmailsDocument);

  knownEmails = computed(
    () => this.knownEmailsQuery.data()?.knownEmails.map((x) => x.toUpperCase()) ?? []
  );

  isLoadingEmails = this.knownEmailsQuery.loading;

  baseInfo = this.nonNullableFormBuilder.group({
    actorId: ['', Validators.required],
    email: [
      { value: '', disabled: true },
      [Validators.required, Validators.email],
      [validateIfAlreadyAssociatedToActor(() => this.selectedActorId()), validateIfDomainExists()],
    ],
  });

  emailChanged = toSignal(this.baseInfo.controls.email.valueChanges);

  actorIdChanged = toSignal(this.baseInfo.controls.actorId.valueChanges);

  selectedActorId = signal<string | null>(null);

  userInfo = this.nonNullableFormBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phoneNumber: ['', [Validators.required]],
  });

  userRoles = this.nonNullableFormBuilder.group({
    selectedUserRoles: [[] as string[], Validators.required],
  });

  constructor() {
    effect(() => {
      const actors = this.actors();

      if (actors.length === 1) {
        const [firstActor] = actors;
        this.baseInfo.controls.actorId.setValue(firstActor.id);
      }
    });

    effect(
      () => {
        const actorId = this.actorIdChanged();

        actorId !== null
          ? this.baseInfo.controls.email.enable()
          : this.baseInfo.controls.email.disable();

        if (!actorId) return;

        this.selectedActorId.set(actorId);
        this.baseInfo.updateValueAndValidity();
        this.changeDectorRef.detectChanges();
      },
      { allowSignalWrites: true }
    );
  }

  open() {
    this.modal().open();
  }

  async inviteUser() {
    if (!this.isBaseInfoValid() || !this.isNewUserInfoValid() || !this.isRolesInfoValid()) {
      return;
    }

    const { firstName, lastName, phoneNumber } = this.userInfo.getRawValue();
    const { email, actorId } = this.baseInfo.getRawValue();

    const phoneParts = phoneNumber.split(' ');
    const [prefix, ...rest] = phoneParts;
    const formattedPhoneNumber = `${prefix} ${rest.join('')}`;

    const result = await this.inviteUserMutation.mutate({
      variables: {
        input: {
          userInviteDto: {
            invitationUserDetails: {
              firstName,
              lastName,
              phoneNumber: formattedPhoneNumber,
            },
            email,
            assignedActor: actorId,
            assignedRoles: this.userRoles.controls.selectedUserRoles.value,
          },
        },
      },
    });

    if (result.data?.inviteUser.success) {
      this.onInviteSuccess(email);
    }

    if (result.error?.graphQLErrors || result.data?.inviteUser.errors) {
      this.onInviteError(result.error?.graphQLErrors, result.data?.inviteUser.errors);
    }
  }

  onSelectedUserRoles(userRoles: UserRoleItem[]) {
    this.userRoles.controls.selectedUserRoles.markAsTouched();
    this.userRoles.controls.selectedUserRoles.setValue(userRoles.map((userRole) => userRole.id));
  }

  close(status: boolean) {
    this.modal().close(status);
  }

  private onInviteSuccess(email: string | null) {
    this.toastService.open({
      type: 'success',
      message: `${this.translocoService.translate(
        'admin.userManagement.inviteUser.successMessage',
        { email: email }
      )}`,
    });
    this.close(true);
  }

  private onInviteError(
    errors: GraphQLErrors | undefined,
    apiErrors: ApiErrorCollection[] | undefined | null
  ) {
    let message = this.translocoService.translate(
      'admin.userManagement.inviteUser.serverErrors.generalError'
    );

    if (errors) {
      message = parseGraphQLErrorResponse(errors) ?? message;
    }

    if (apiErrors) {
      message = readApiErrorResponse(apiErrors) ?? message;
    }

    this.toastService.open({ type: 'danger', message, duration: 60_000 });
  }

  private isBaseInfoValid() {
    return this.baseInfo.valid;
  }

  private isNewUserInfoValid() {
    return this.userInfo.valid || this.emailExists() || !this.inOrganizationMailDomain();
  }

  private isRolesInfoValid() {
    return this.userRoles.valid;
  }
}
