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
import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { getActorOptions } from '@energinet-datahub/dh/shared/data-access-graphql';
import { EicFunction, GetActorByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WATT_MODAL, WattModalService, WattTypedModal } from '@energinet-datahub/watt/modal';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@ngneat/transloco';
import { RxPush } from '@rx-angular/template/push';

import { DhRequestSettlementReportModalComponent } from '../modal/dh-request-settlement-report-modal.component';
import { Apollo } from 'apollo-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  DhActorStorage,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';

type DhFormType = FormGroup<{
  actorId: FormControl<string>;
}>;

@Component({
  selector: 'dh-request-as-settlement-report-modal',
  standalone: true,
  imports: [
    RxPush,
    ReactiveFormsModule,
    TranslocoDirective,

    WATT_MODAL,
    VaterStackComponent,
    WattDropdownComponent,
    WattButtonComponent,
    WattFieldErrorComponent,
  ],
  templateUrl: './dh-request-as-settlement-report-modal.component.html',
})
export class DhRequestAsSettlementReportModalComponent extends WattTypedModal {
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

  actorOptions$ = getActorOptions(
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
          this.modalService.open({
            component: DhRequestSettlementReportModalComponent,
            data: {
              isFas,
              actorId: this.actorStorage.getSelectedActor().id,
              marketRole: this.actorStorage.getSelectedActor().marketRole,
            },
          });

          this.submitInProgress.set(false);
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
          this.modalService.open({
            component: DhRequestSettlementReportModalComponent,
            data: {
              isFas: false,
              actorId: result.data.actorById.id,
              marketRole: result.data.actorById.marketRole,
            },
          });

          this.submitInProgress.set(false);
        });
    }
  }
}
