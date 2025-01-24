import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'dh-customer-cpr',
  imports: [TranslocoDirective],
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
  `,
  template: `
    <ng-container *transloco="let t; read: 'meteringPoint.overview.customer'">
      <button type="button" class="show-cpr-button">
        {{ t('showCPRButton') }}
      </button>
    </ng-container>
  `,
})
export class DhCustomerCprComponent {}
