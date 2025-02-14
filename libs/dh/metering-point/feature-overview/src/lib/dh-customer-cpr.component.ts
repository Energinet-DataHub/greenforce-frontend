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
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { GetContactCprDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

@Component({
  selector: 'dh-customer-cpr',
  imports: [TranslocoDirective, WattSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .show-cpr-button {
      background-color: var(--watt-color-neutral-white);
      border: 1px solid var(--watt-color-neutral-grey-600);
      border-radius: 2px;
      color: var(--watt-on-light-medium-emphasis);
      padding: var(--watt-space-xs) var(--watt-space-s);

      &:hover {
        cursor: pointer;
      }
    }

    .cpr {
      display: inline-block;
      line-height: 26px;
    }
  `,
  template: `
    <ng-container *transloco="let t; read: 'meteringPoint.overview.customer'">
      @if (loading()) {
        <watt-spinner [diameter]="26" />
      } @else {
        @if (cpr()) {
          <span class="cpr">{{ cpr() }}</span>
        } @else {
          <button type="button" class="show-cpr-button" (click)="showCPR()">
            {{ t('showCPRButton') }}
          </button>
        }
      }
    </ng-container>
  `,
})
export class DhCustomerCprComponent {
  private query = lazyQuery(GetContactCprDocument);

  loading = this.query.loading;
  cpr = computed<string | null>(() => this.query.data()?.meteringPointContactCpr ?? null);

  contactId = input.required<string>();

  showCPR(): void {
    this.query.query({
      variables: {
        contactId: this.contactId(),
      },
    });
  }
}
