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
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChangeDetectionStrategy, Component, viewChild, inject } from '@angular/core';
import { translate, TranslocoDirective } from '@jsverse/transloco';

import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattTypedModal, WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattTextAreaFieldComponent } from '@energinet-datahub/watt/textarea-field';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  AddMeteringPointsToAdditionalRecipientDocument,
  AddMeteringPointsToAdditionalRecipientMutation,
  GetAdditionalRecipientOfMeasurementsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { readApiErrorResponse } from '@energinet-datahub/dh/market-participant/data-access-api';

import { dhMeteringPointIDsValidator } from './metering-point-ids.validator';

@Component({
  selector: 'dh-set-up-access-to-measurements',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './set-up-access-to-measurements.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WattButtonComponent,
    WattTextAreaFieldComponent,
    WattFieldHintComponent,
    WattFieldErrorComponent,
    VaterStackComponent,
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhSetUpAccessToMeasurements extends WattTypedModal<DhActorExtended> {
  private formBuilder = inject(NonNullableFormBuilder);
  private toastService = inject(WattToastService);

  private addMeteringPointsToAdditionalRecipient = mutation(
    AddMeteringPointsToAdditionalRecipientDocument
  );

  modal = viewChild.required(WattModalComponent);

  form = this.formBuilder.group({
    meteringPointIDs: new FormControl<string>('', [
      Validators.required,
      dhMeteringPointIDsValidator(),
    ]),
  });

  closeModal(result: boolean) {
    this.modal().close(result);
  }

  save() {
    if (this.form.invalid) return;

    const { meteringPointIDs } = this.form.getRawValue();

    if (!meteringPointIDs) return;

    this.addMeteringPointsToAdditionalRecipient.mutate({
      variables: {
        input: {
          meteringPointIds: meteringPointIDs.split(',').map((id) => id.trim()),
        },
      },
      refetchQueries: [GetAdditionalRecipientOfMeasurementsDocument],
      onCompleted: (result) => this.handleResponse(result),
    });
  }

  private handleResponse({
    addMeteringPointsToAdditionalRecipient,
  }: AddMeteringPointsToAdditionalRecipientMutation): void {
    if (
      addMeteringPointsToAdditionalRecipient?.errors &&
      addMeteringPointsToAdditionalRecipient?.errors.length > 0
    ) {
      this.toastService.open({
        type: 'danger',
        message: readApiErrorResponse(addMeteringPointsToAdditionalRecipient?.errors),
      });
    }

    if (addMeteringPointsToAdditionalRecipient.success) {
      this.toastService.open({
        type: 'success',
        message: translate('marketParticipant.accessToMeasurements.createSuccess'),
      });

      this.closeModal(true);
    }
  }
}
