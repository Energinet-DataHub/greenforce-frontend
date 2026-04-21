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
import { ChangeDetectionStrategy, Component, computed, effect, input, signal, untracked } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattFieldErrorComponent } from '@energinet/watt/field';
import { WattCheckboxComponent } from '@energinet/watt/checkbox';
import { WattSpinnerComponent } from '@energinet/watt/spinner';
import { VaterFlexComponent } from '@energinet/watt/vater';

import { GetContactCprDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { dhMakeFormControl, dhFormControlToSignal } from '@energinet-datahub/dh/shared/ui-util';

import { PrivateCustomerFormGroup } from '../types';

const MASKED_CPR = '●●●●●●●●●●';

@Component({
  selector: 'dh-private-customer-details',
  imports: [
    ReactiveFormsModule,
    WattTextFieldComponent,
    TranslocoDirective,
    WattFieldErrorComponent,
    WattCheckboxComponent,
    WattSpinnerComponent,
    VaterFlexComponent,
    DhPermissionRequiredDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .margin-top-l {
      margin-top: var(--watt-space-l);
    }
  `,
  template: `
    @let formGroup = privateCustomerFormGroup();
    <ng-container *transloco="let t; prefix: 'meteringPoint.moveIn.customerDetails'">
      <h4>{{ t('customer1') }}</h4>
      <watt-text-field [label]="t('name')" [formControl]="formGroup.controls.customerName1" />
      @if (showCpr1()) {
        <watt-text-field [label]="t('cpr')" [formControl]="formGroup.controls.cpr1" maxLength="10">
          <watt-field-error>
            @if (formGroup.controls.cpr1.hasError('containsLetters')) {
              {{ t('cprError.containsLetters') }}
            } @else if (formGroup.controls.cpr1.hasError('containsDash')) {
              {{ t('cprError.containsDash') }}
            } @else if (formGroup.controls.cpr1.hasError('invalidCprLength')) {
              {{ t('cprError.invalidCprLength') }}
            } @else if (formGroup.controls.cpr1.hasError('invalidDate')) {
              {{ t('cprError.invalidDate') }}
            } @else if (formGroup.controls.cpr1.hasError('allOnes')) {
              {{ t('cprError.allOnes') }}
            }
          </watt-field-error>
        </watt-text-field>
      } @else {
        <watt-text-field [label]="t('cpr')" [formControl]="maskedCpr1Control" />
      }
      <ng-container *dhPermissionRequired="['cpr:view']">
        <vater-flex align="start" gap="s" class="watt-space-stack-m">
          <watt-checkbox [formControl]="cpr1CheckboxControl">
            {{ t('changeCpr') }}
          </watt-checkbox>
          @if (cpr1Loading()) {
            <watt-spinner [diameter]="18" />
          }
        </vater-flex>
      </ng-container>

      <h4>{{ t('customer2') }}</h4>
      <watt-text-field [label]="t('name')" [formControl]="formGroup.controls.customerName2" />
      @if (showCpr2()) {
        <watt-text-field
          [label]="t('cpr')"
          [formControl]="formGroup.controls.cpr2"
          class="watt-space-stack-l"
          maxLength="10"
        >
          <watt-field-error>
            @if (formGroup.controls.cpr2.hasError('containsLetters')) {
              {{ t('cprError.containsLetters') }}
            } @else if (formGroup.controls.cpr2.hasError('containsDash')) {
              {{ t('cprError.containsDash') }}
            } @else if (formGroup.controls.cpr2.hasError('invalidCprLength')) {
              {{ t('cprError.invalidCprLength') }}
            } @else if (formGroup.controls.cpr2.hasError('invalidDate')) {
              {{ t('cprError.invalidDate') }}
            } @else if (formGroup.controls.cpr2.hasError('allOnes')) {
              {{ t('cprError.allOnes') }}
            }
          </watt-field-error>
        </watt-text-field>
      } @else {
        <watt-text-field [label]="t('cpr')" [formControl]="maskedCpr2Control"/>
      }
      <ng-container *dhPermissionRequired="['cpr:view']">
        <vater-flex align="start" gap="s" class="watt-space-stack-m">
          <watt-checkbox [formControl]="cpr2CheckboxControl">
            {{ t('changeCpr') }}
          </watt-checkbox>
          @if (cpr2Loading()) {
            <watt-spinner [diameter]="18" />
          }
        </vater-flex>
      </ng-container>

      <watt-checkbox
        [formControl]="formGroup.controls.nameProtection"
        class="watt-space-stack-m margin-top-l"
        data-testid="name-protection"
      >
        {{ t('nameProtection') }}
      </watt-checkbox>
    </ng-container>
  `,
})
export class DhPrivateCustomerDetailsComponent {
  privateCustomerFormGroup = input.required<FormGroup<PrivateCustomerFormGroup>>();
  meteringPointId = input.required<string>();
  contactId1 = input<string | null>(null);
  contactId2 = input<string | null>(null);
  searchMigratedMeteringPoints = input.required<boolean>();

  private readonly cprLoaded1 = signal(false);
  private readonly cprLoaded2 = signal(false);

  private cpr1Query = lazyQuery(GetContactCprDocument);
  private cpr2Query = lazyQuery(GetContactCprDocument);

  cpr1Loading = this.cpr1Query.loading;
  cpr2Loading = this.cpr2Query.loading;

  /** Disabled form controls used to display masked CPR placeholder */
  protected readonly maskedCpr1Control = dhMakeFormControl({ value: MASKED_CPR, disabled: true });
  protected readonly maskedCpr2Control = dhMakeFormControl({ value: MASKED_CPR, disabled: true });

  /** Checkbox controls for unlocking CPR fields */
  protected readonly cpr1CheckboxControl = dhMakeFormControl<boolean>({ value: false, disabled: false });
  protected readonly cpr2CheckboxControl = dhMakeFormControl<boolean>({ value: false, disabled: false });

  private readonly cpr1Checked = dhFormControlToSignal(this.cpr1CheckboxControl);
  private readonly cpr2Checked = dhFormControlToSignal(this.cpr2CheckboxControl);

  /** Show the real CPR field when the checkbox is checked AND either there is no contactId (new entry) or the CPR was loaded from the API */
  protected readonly showCpr1 = computed(() => this.cpr1Checked() && (this.cprLoaded1() || !this.contactId1()));
  protected readonly showCpr2 = computed(() => this.cpr2Checked() && (this.cprLoaded2() || !this.contactId2()));

  private readonly fillCpr1 = effect(() => {
    const cpr = this.cpr1Query.data()?.meteringPointContactCpr.result;
    if (cpr) {
      this.privateCustomerFormGroup().controls.cpr1.setValue(cpr);
      this.cprLoaded1.set(true);
    }
  });

  private readonly fillCpr2 = effect(() => {
    const cpr = this.cpr2Query.data()?.meteringPointContactCpr.result;
    if (cpr) {
      this.privateCustomerFormGroup().controls.cpr2.setValue(cpr);
      this.cprLoaded2.set(true);
    }
  });

  private readonly handleCpr1Toggle = effect(() => {
    const checked = this.cpr1Checked();
    untracked(() => {
      if (checked) {
        this.loadCpr1();
      } else {
        this.privateCustomerFormGroup().controls.cpr1.setValue('');
        this.cprLoaded1.set(false);
      }
    });
  });

  private readonly handleCpr2Toggle = effect(() => {
    const checked = this.cpr2Checked();
    untracked(() => {
      if (checked) {
        this.loadCpr2();
      } else {
        this.privateCustomerFormGroup().controls.cpr2.setValue('');
        this.cprLoaded2.set(false);
      }
    });
  });

  private loadCpr1(): void {
    const contactId = this.contactId1();
    if (!contactId) return; // showCpr1 computed handles the no-contactId case automatically
    this.cpr1Query.query({
      variables: {
        meteringPointId: this.meteringPointId(),
        contactId,
        searchMigratedMeteringPoints: this.searchMigratedMeteringPoints(),
      },
    });
  }

  private loadCpr2(): void {
    const contactId = this.contactId2();
    if (!contactId) return; // showCpr2 computed handles the no-contactId case automatically
    this.cpr2Query.query({
      variables: {
        meteringPointId: this.meteringPointId(),
        contactId,
        searchMigratedMeteringPoints: this.searchMigratedMeteringPoints(),
      },
    });
  }
}
