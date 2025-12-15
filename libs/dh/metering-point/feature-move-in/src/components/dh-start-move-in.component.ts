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
import { ChangeDetectionStrategy, Component, effect, inject, viewChild } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet/watt/modal';
import { dhCprValidator, dhCvrValidator } from '@energinet-datahub/dh/shared/ui-validators';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  MoveInType,
  StartMoveInDocument,
  WashInstructions,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattToastService } from '@energinet/watt/toast';

import { InstallationAddress, StartMoveInFormType } from '../types';
import { DhStartMoveInFormComponent } from './dh-start-move-in-form.component';
import { WattButtonComponent } from '@energinet/watt/button';

@Component({
  selector: 'dh-start-move-in-modal',
  imports: [TranslocoDirective, WATT_MODAL, DhStartMoveInFormComponent, WattButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <watt-modal
      size="large"
      [title]="t('title')"
      *transloco="let t; prefix: 'meteringPoint.moveIn'"
    >
      <dh-start-move-in-form [startMoveInForm]="startMoveInForm" />
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="startMoveIn()">{{ t('save') }} </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhStartMoveInComponent extends WattTypedModal<{
  installationAddress: InstallationAddress;
}> {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly transloco = inject(TranslocoService);
  private readonly startMoveInMutation = mutation(StartMoveInDocument);
  private readonly toastService = inject(WattToastService);

  readonly modal = viewChild.required(WattModalComponent);

  private readonly customerTypeInitialValue = 'private';

  private privateCustomerForm = this.fb.group({
    name1: this.fb.control<string>('', Validators.required),
    cpr1: this.fb.control<string>('', [Validators.required, dhCprValidator()]),
  });

  startMoveInForm = this.fb.group<StartMoveInFormType>({
    cutOffDate: this.fb.control(new Date(), Validators.required),
    moveInType: this.fb.control<MoveInType | null>(null, Validators.required),
    customerType: this.fb.control(this.customerTypeInitialValue),
  });

  readonly isForeignCompanyFormControl = this.fb.control<boolean>(false);

  private customerTypeChanged = toSignal(this.startMoveInForm.controls.customerType.valueChanges, {
    initialValue: this.customerTypeInitialValue,
  });

  private isForeignCompanyChanged = toSignal<boolean>(
    this.isForeignCompanyFormControl.valueChanges
  );

  private customerTypeEffect = effect(() => {
    const customerType = this.customerTypeChanged();

    if (customerType === 'private') {
      this.startMoveInForm.addControl('privateCustomer', this.privateCustomerForm);
      this.startMoveInForm.removeControl('businessCustomer');
    } else {
      this.startMoveInForm.addControl(
        'businessCustomer',
        this.fb.group({
          companyName: this.fb.control<string>('', Validators.required),
          cvr: this.fb.control<string>('', [Validators.required, dhCvrValidator()]),
          isForeignCompany: this.isForeignCompanyFormControl,
        })
      );

      this.startMoveInForm.removeControl('privateCustomer');
      this.privateCustomerForm.reset();
    }
  });

  private isForeignCompanyEffect = effect(() => {
    const isForeignCompany = this.isForeignCompanyChanged();
    if (isForeignCompany) {
      this.startMoveInForm.controls.businessCustomer?.controls.cvr.disable();
      this.startMoveInForm.controls.businessCustomer?.controls.cvr.setValue('11111111');
    } else {
      this.startMoveInForm.controls.businessCustomer?.controls.cvr.enable();
      this.startMoveInForm.controls.businessCustomer?.controls.cvr.reset();
    }
  });

  async startMoveIn() {
    if (this.startMoveInForm.invalid) {
      return;
    }

    const { moveInType } = this.startMoveInForm.getRawValue();

    if (!moveInType) return;

    const result = await this.startMoveInMutation.mutate({
      variables: {
        input: {
          cutOffDate: '',
          moveInType,
          customerType: '',
          privateCustomerName1: '',
          privateCustomerCpr1: '',
          privateCustomerName2: '',
          privateCustomerCpr2: '',
          businessCustomerCompanyName: '',
          businessCustomerCvr: '',
          customerIsProtectedAddress: false,
          legalContactDetails: {
            name: '',
            attention: '',
            phone: '',
            mobile: '',
            email: '',
          },
          legalAddress: {
            streetName: '',
            buildingNumber: '',
            floor: '',
            room: '',
            postCode: '',
            cityName: '',
            countryCode: '',
            streetCode: '',
            postBox: '',
            municipalityCode: '',
            darReference: '',
            citySubDivisionName: '',
            washInstructions: WashInstructions.Washable,
          },
          technicalContactDetails: {
            name: '',
            attention: '',
            phone: '',
            mobile: '',
            email: '',
          },
          technicalAddress: {
            streetName: '',
            buildingNumber: '',
            floor: '',
            room: '',
            postCode: '',
            cityName: '',
            countryCode: '',
            streetCode: '',
            postBox: '',
            municipalityCode: '',
            darReference: '',
            citySubDivisionName: '',
            washInstructions: WashInstructions.Washable,
          },
        },
      },
    });

    if (result.data?.startMoveIn.success) {
      this.success();
    }
  }

  private success() {
    const message = this.transloco.translate('meteringPoint.moveIn.moveInSuccess');

    this.toastService.open({ type: 'success', message });
    this.modal().close(true);
  }
}
