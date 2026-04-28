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
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattFieldErrorComponent } from '@energinet/watt/field';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattSpinnerComponent } from '@energinet/watt/spinner';
import { WATT_MODAL, WattModalComponent } from '@energinet/watt/modal';

import { GetContactCprDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { dhCprValidator } from '@energinet-datahub/dh/shared/ui-validators';

const MASKED_CPR = '0000000000';

/**
 * A self-contained CPR field that handles masked display, user unlock confirmation,
 * CPR fetching and validation. Renders consistently whether locked or unlocked.
 *
 * Host width is fixed so the field never jumps between the masked (with edit button)
 * and the editable state.
 */
@Component({
  selector: 'dh-cpr-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    /**
     * Fixed width:
     * - 10ch   covers 10 decimal digits with some breathing room
     * - 1rem covers the field's horizontal padding (left + right)
     * - 2rem   covers the icon button in the masked state
     * All three are always reserved so the field never resizes on state change.
     */
    style: 'display: block; width: calc(10ch + 3rem)',
  },
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    WattButtonComponent,
    WattSpinnerComponent,
    WATT_MODAL,
    DhPermissionRequiredDirective,
  ],
  template: `
    <ng-container *transloco="let t; prefix: 'meteringPoint.moveIn.customerDetails'">
      @if (showCprField()) {
        <watt-text-field [label]="t('cpr')" [formControl]="cprControl()" maxLength="10">
          <watt-field-error>
            @if (cprControl().hasError('containsLetters')) {
              {{ t('cprError.containsLetters') }}
            } @else if (cprControl().hasError('containsDash')) {
              {{ t('cprError.containsDash') }}
            } @else if (cprControl().hasError('invalidCprLength')) {
              {{ t('cprError.invalidCprLength') }}
            } @else if (cprControl().hasError('invalidDate')) {
              {{ t('cprError.invalidDate') }}
            } @else if (cprControl().hasError('allOnes')) {
              {{ t('cprError.allOnes') }}
            }
          </watt-field-error>
        </watt-text-field>
      } @else {
        <watt-text-field [type]="'password'" [label]="t('cpr')" [formControl]="maskedControl">
          <ng-container *dhPermissionRequired="['cpr:view']">
            @if (cprQuery.loading()) {
              <watt-spinner class="descriptor" [diameter]="18" />
            } @else {
              <watt-button class="descriptor" variant="icon" icon="edit" (click)="openModal()" />
            }
          </ng-container>
        </watt-text-field>
      }

      <watt-modal
        #modal
        [title]="t('editCprModal.title')"
        size="small"
        (closed)="onModalClosed($event)"
      >
        <p>{{ t('editCprModal.description') }}</p>
        <watt-modal-actions>
          <watt-button variant="secondary" (click)="modal.close(false)">
            {{ t('editCprModal.no') }}
          </watt-button>
          <watt-button (click)="modal.close(true)">
            {{ t('editCprModal.yes') }}
          </watt-button>
        </watt-modal-actions>
      </watt-modal>
    </ng-container>
  `,
})
export class DhCprFieldComponent {
  cprControl = input.required<FormControl<string | null>>();
  contactId = input<string | null>(null);
  meteringPointId = input.required<string>();
  searchMigratedMeteringPoints = input.required<boolean>();

  private readonly modal = viewChild.required<WattModalComponent>('modal');
  private readonly unlocked = signal(false);
  private readonly loaded = signal(false);

  protected readonly cprQuery = lazyQuery(GetContactCprDocument);

  protected readonly maskedControl = dhMakeFormControl({ value: MASKED_CPR, disabled: true });

  protected readonly showCprField = computed(
    () => this.unlocked() && (this.loaded() || !this.contactId())
  );

  private readonly fillCpr = effect(() => {
    const cpr = this.cprQuery.data()?.meteringPointContactCpr.result;
    if (cpr) {
      this.cprControl().setValue(cpr);
      this.loaded.set(true);
    }
  });

  protected openModal(): void {
    this.modal().open();
  }

  protected onModalClosed(accepted: boolean): void {
    if (!accepted) return;

    this.unlocked.set(true);
    const control = this.cprControl();
    control.setValidators([Validators.required, dhCprValidator()]);
    control.updateValueAndValidity();

    const contactId = this.contactId();
    if (contactId) {
      this.cprQuery.query({
        variables: {
          meteringPointId: this.meteringPointId(),
          contactId,
          searchMigratedMeteringPoints: this.searchMigratedMeteringPoints(),
        },
      });
    }
  }
}





