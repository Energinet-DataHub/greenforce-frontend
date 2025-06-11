//#region License
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
//#endregion
import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { Apollo } from 'apollo-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WATT_MODAL, WattModalService, WattTypedModal } from '@energinet-datahub/watt/modal';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { getActorOptionsSignal } from '@energinet-datahub/dh/shared/data-access-graphql';
import { EicFunction, GetActorByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhActorStorage,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';

import { DhRequestReportModal } from './request-report-modal.component';

type DhFormType = FormGroup<{
  actorId: FormControl<string>;
}>;

@Component({
  selector: 'dh-request-as-modal',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    WATT_MODAL,
    VaterStackComponent,
    WattDropdownComponent,
    WattButtonComponent,
  ],
  templateUrl: './request-as-modal.component.html',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhRequestAsModal extends WattTypedModal {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly modalService = inject(WattModalService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly apollo = inject(Apollo);

  private readonly permissionService = inject(PermissionService);
  private readonly actorStorage = inject(DhActorStorage);

  form: DhFormType = this.formBuilder.group({
    actorId: new FormControl<string>(this.actorStorage.getSelectedActorId(), {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  actorOptions = getActorOptionsSignal(
    [EicFunction.DataHubAdministrator, EicFunction.GridAccessProvider, EicFunction.EnergySupplier],
    'actorId'
  );

  submitInProgress = signal(false);

  submit(): void {
    if (this.form.invalid || !this.form.value.actorId) {
      return;
    }

    this.submitInProgress.set(true);

    if (this.form.value.actorId == this.actorStorage.getSelectedActorId()) {
      this.permissionService
        .isFas()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((isFas) => {
          this.openModal({
            isFas,
            actorId: this.actorStorage.getSelectedActor()?.id,
            marketRole: this.actorStorage.getSelectedActor()?.marketRole,
          });
        });
    } else {
      this.apollo
        .query({
          query: GetActorByIdDocument,
          variables: {
            id: this.form.value.actorId,
          },
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((result) => {
          this.openModal({
            isFas: false,
            actorId: result.data.actorById.id,
            marketRole: result.data.actorById.marketRole,
          });
        });
    }
  }

  private openModal({
    isFas,
    actorId,
    marketRole,
  }: {
    isFas: boolean;
    actorId?: string;
    marketRole?: string;
  }) {
    this.modalService.close(true);

    this.modalService.open({
      component: DhRequestReportModal,
      data: {
        isFas,
        actorId,
        marketRole,
      },
    });

    this.submitInProgress.set(false);
  }
}
