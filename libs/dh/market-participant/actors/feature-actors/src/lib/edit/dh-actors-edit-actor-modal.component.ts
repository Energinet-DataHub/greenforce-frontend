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
import { tap } from 'rxjs';
import { RxLet } from '@rx-angular/template/let';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { NgIf } from '@angular/common';
import { Component, Input, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { dhDkPhoneNumberValidator } from '@energinet-datahub/dh/shared/ui-validators';
import { DhMarketParticipantActorsEditActorDataAccessApiStore } from '@energinet-datahub/dh/market-participant/actors/data-access-api';

import { DhActorExtended } from '../dh-actor';

@Component({
  standalone: true,
  selector: 'dh-actors-edit-actor-modal',
  templateUrl: './dh-actors-edit-actor-modal.component.html',
  providers: [DhMarketParticipantActorsEditActorDataAccessApiStore],
  styles: [
    `
      .actor-field {
        width: 25em;
      }

      .contact-field {
        width: 25em;
      }

      .phone-field {
        width: 15em;
      }

      .email-suffix {
        padding-right: var(--watt-space-s);
      }
    `,
  ],
  imports: [
    RxLet,
    NgIf,
    ReactiveFormsModule,
    TranslocoDirective,

    WATT_MODAL,
    WattButtonComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
  ],
})
export class DhActorsEditActorModalComponent {
  private readonly dataAccessStore = inject(DhMarketParticipantActorsEditActorDataAccessApiStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly transloco = inject(TranslocoService);
  private readonly toastService = inject(WattToastService);

  @ViewChild(WattModalComponent)
  innerModal: WattModalComponent | undefined;

  @Input() actor: DhActorExtended | undefined;

  actorForm = this.formBuilder.group({
    name: ['', Validators.required],
    departmentName: ['', Validators.required],
    departmentEmail: ['', [Validators.required, Validators.email]],
    departmentPhone: ['', [Validators.required, dhDkPhoneNumberValidator]],
  });

  isLoading = true;

  formInitialValues$ = this.dataAccessStore.actorEditableFields$.pipe(
    tap((queryResult) => {
      this.isLoading = queryResult.loading;

      if (!queryResult.data || queryResult.loading) return;

      this.actorForm.markAsUntouched();
      this.actorForm.patchValue({
        name: queryResult.data.actorById.name,
        departmentName: queryResult.data.actorById.contact?.name,
        departmentPhone: queryResult.data.actorById.contact?.phone,
        departmentEmail: queryResult.data.actorById.contact?.email,
      });
    })
  );

  open() {
    if (!this.actor) return;
    this.dataAccessStore.load(this.actor.id);
    this.innerModal?.open();
  }

  save() {
    if (
      !this.actor ||
      !this.actorForm.value.name ||
      !this.actorForm.value.departmentName ||
      !this.actorForm.value.departmentPhone ||
      !this.actorForm.value.departmentEmail ||
      !this.actorForm.valid
    )
      return;

    this.dataAccessStore
      .update({
        actorId: this.actor.id,
        actorName: this.actorForm.value.name,
        departmentName: this.actorForm.value.departmentName,
        departmentPhone: this.actorForm.value.departmentPhone,
        departmentEmail: this.actorForm.value.departmentEmail,
      })
      .subscribe((queryResult) => {
        this.isLoading = queryResult.loading;

        if (queryResult.loading) return;

        if (queryResult.data && !queryResult.data.updateActor.errors && !queryResult.errors) {
          const message = this.transloco.translate(
            'marketParticipant.actorsOverview.edit.updateRequest.success'
          );
          this.toastService.open({ message, type: 'success' });
        } else {
          const message = this.transloco.translate(
            'marketParticipant.actorsOverview.edit.updateRequest.error'
          );
          this.toastService.open({ message, type: 'danger' });
        }

        this.innerModal?.close(true);
      });
  }

  close() {
    this.innerModal?.close(false);
  }
}
