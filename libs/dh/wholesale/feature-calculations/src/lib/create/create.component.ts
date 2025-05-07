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
import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { map } from 'rxjs';

import { WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';

import {
  CreateCalculationDocument,
  StartCalculationType,
  GetCalculationsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { mutation, MutationStatus } from '@energinet-datahub/dh/shared/util-apollo';
import { DhCalculationsCreateFormComponent } from './create-form';

/** Helper function for displaying a toast message based on MutationStatus. */
const injectToast = () => {
  const transloco = inject(TranslocoService);
  const toast = inject(WattToastService);
  const t = (key: string) => transloco.translate(`wholesale.calculations.create.toast.${key}`);
  return (status: MutationStatus) => {
    switch (status) {
      case MutationStatus.Loading:
        return toast.open({ type: 'loading', message: t('loading') });
      case MutationStatus.Error:
        return toast.update({ type: 'danger', message: t('error') });
      case MutationStatus.Resolved:
        return toast.update({ type: 'success', message: t('success') });
    }
  };
};

@Component({
  selector: 'dh-calculations-create',
  templateUrl: './create.component.html',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WATT_MODAL,
    VaterFlexComponent,
    WattButtonComponent,
    WattFieldHintComponent,
    WattTextFieldComponent,
    WattValidationMessageComponent,
    DhCalculationsCreateFormComponent,
  ],
})
export class DhCalculationsCreateComponent {
  create = mutation(CreateCalculationDocument, { refetchQueries: [GetCalculationsDocument] });
  toast = injectToast(); // TODO: Make shared
  toastEffect = effect(() => this.toast(this.create.status()));

  modal = viewChild(WattModalComponent);
  calculationToConfirm = signal<StartCalculationType | null>(null);
  confirmControl = new FormControl('');
  confirmText = toSignal(this.confirmControl.valueChanges.pipe(map((v) => v?.toUpperCase())));

  open = () => {
    this.modal()?.open();
  };

  reset() {
    // TODO
    //   this.latestCalculation.reset();
    //   this.showPeriodWarning = false;
    //   this.formGroup.reset();
    //   // This is apparently neccessary to reset the dropdown validity state
    //   this.formGroup.controls.calculationType.setErrors(null);
    //   this.confirmControl.reset();
  }
}
