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
import { Component, computed, inject, viewChild } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {
  CalculationType,
  GetRequestOptionsDocument,
  RequestCalculationDataType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { WattRange, dayjs } from '@energinet-datahub/watt/date';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';

type rangeControl = AbstractControl<WattRange<string>>;

const max31DaysDateRangeValidator: ValidatorFn = ({ value }: rangeControl) => {
  if (!value?.end || !value?.start) return null;
  // Since the date range does not include the last millisecond (ends at 23:59:59.999),
  // this condition checks for 30 days, not 31 days (as the diff is in whole days only).
  return dayjs(value.end).diff(value.start, 'days') > 30 ? { max31DaysDateRange: true } : null;
};

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  selector: 'dh-wholesale-requests-new',
  standalone: true,
  imports: [MatSelectModule, ReactiveFormsModule, WattDropdownComponent, WattModalComponent],
  template: `
    <watt-modal #modal size="small">
      <watt-dropdown [formControl]="form.controls.calculationType" />
    </watt-modal>
  `,
})
export class DhWholesaleRequestsNew {
  private modal = viewChild.required(WattModalComponent);

  form = new FormGroup({
    calculationType: dhMakeFormControl(CalculationType.Aggregation, Validators.required),
    period: dhMakeFormControl<WattRange<string>>(null, [
      Validators.required,
      WattRangeValidators.required,
      max31DaysDateRangeValidator,
    ]),
    gridArea: dhMakeFormControl<string>(null),
    requestCalculationDataType: dhMakeFormControl<RequestCalculationDataType>(
      null,
      Validators.required
    ),
    energySupplierId: dhMakeFormControl<string>(null),
    balanceResponsibleId: dhMakeFormControl<string>(null),
  });

  opts = query(GetRequestOptionsDocument, { fetchPolicy: 'no-cache' });

  calculationTypeOptions = computed(
    () => (this.opts.data()?.requests.calculationTypeOptions ?? []) as any
  );

  open = () => this.modal().open();
}

// translateKey="wholesale.requests.calculationTypes"
// dhDropdownTranslator
