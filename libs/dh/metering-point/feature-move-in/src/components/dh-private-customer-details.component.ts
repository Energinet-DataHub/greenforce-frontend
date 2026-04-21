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
import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattFieldErrorComponent } from '@energinet/watt/field';
import { WattCheckboxComponent } from '@energinet/watt/checkbox';
import { WattSpinnerComponent } from '@energinet/watt/spinner';
import { WattButtonComponent } from '@energinet/watt/button';

import { GetContactCprDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { PrivateCustomerFormGroup } from '../types';

@Component({
  selector: 'dh-private-customer-details',
  imports: [
    ReactiveFormsModule,
    WattTextFieldComponent,
    TranslocoDirective,
    WattFieldErrorComponent,
    WattCheckboxComponent,
    WattSpinnerComponent,
    WattButtonComponent,
    DhPermissionRequiredDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .change-cpr-button {
      margin-bottom: var(--watt-space-m);
    }
  `,
  template: `
    @let formGroup = privateCustomerFormGroup();
    <ng-container *transloco="let t; prefix: 'meteringPoint.moveIn.customerDetails'">
      <h4>{{ t('customer1') }}</h4>
      <watt-text-field [label]="t('name')" [formControl]="formGroup.controls.customerName1" />
      @if (cpr1Loading()) {
        <watt-spinner [diameter]="22" />
      } @else if (showCpr1()) {
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
        <ng-container *dhPermissionRequired="['cpr:view']">
          <watt-button
            class="change-cpr-button"
            variant="secondary"
            type="button"
            (click)="changeCpr1()"
          >
            {{ t('changeCpr') }}
          </watt-button>
        </ng-container>
      }
      <h4>{{ t('customer2') }}</h4>
      <watt-text-field [label]="t('name')" [formControl]="formGroup.controls.customerName2" />
      @if (cpr2Loading()) {
        <watt-spinner [diameter]="22" />
      } @else if (showCpr2()) {
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
        <ng-container *dhPermissionRequired="['cpr:view']">
          <watt-button
            class="change-cpr-button watt-space-stack-l"
            variant="secondary"
            type="button"
            (click)="changeCpr2()"
          >
            {{ t('changeCpr') }}
          </watt-button>
        </ng-container>
      }
      <watt-checkbox
        [formControl]="formGroup.controls.nameProtection"
        class="watt-space-stack-m"
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

  showCpr1 = signal(false);
  showCpr2 = signal(false);

  private cpr1Query = lazyQuery(GetContactCprDocument);
  private cpr2Query = lazyQuery(GetContactCprDocument);

  cpr1Loading = this.cpr1Query.loading;
  cpr2Loading = this.cpr2Query.loading;

  private readonly fillCpr1 = effect(() => {
    const cpr = this.cpr1Query.data()?.meteringPointContactCpr.result;
    if (cpr) {
      this.privateCustomerFormGroup().controls.cpr1.setValue(cpr);
      this.showCpr1.set(true);
    }
  });

  private readonly fillCpr2 = effect(() => {
    const cpr = this.cpr2Query.data()?.meteringPointContactCpr.result;
    if (cpr) {
      this.privateCustomerFormGroup().controls.cpr2.setValue(cpr);
      this.showCpr2.set(true);
    }
  });

  changeCpr1(): void {
    const contactId = this.contactId1();
    if (!contactId) {
      this.showCpr1.set(true);
      return;
    }
    this.cpr1Query.query({
      variables: {
        meteringPointId: this.meteringPointId(),
        contactId,
        searchMigratedMeteringPoints: this.searchMigratedMeteringPoints(),
      },
    });
  }

  changeCpr2(): void {
    const contactId = this.contactId2();
    if (!contactId) {
      this.showCpr2.set(true);
      return;
    }
    this.cpr2Query.query({
      variables: {
        meteringPointId: this.meteringPointId(),
        contactId,
        searchMigratedMeteringPoints: this.searchMigratedMeteringPoints(),
      },
    });
  }
}
