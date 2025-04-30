import { Component } from '@angular/core';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'dh-customer-protected',
  imports: [WattIconComponent, TranslocoDirective, VaterStackComponent],
  styles: `
    :host {
      display: flex;
    }
    .protected-address {
      background: var(--watt-color-secondary-ultralight);
      color: var(--watt-color-neutral-grey-800);
      border-radius: 12px;
      align-self: start;
    }
  `,
  template: `
    <div
      *transloco="let t; read: 'meteringPoint.overview.customer'"
      vater-stack
      direction="row"
      gap="s"
      class="watt-space-inset-squish-s watt-space-stack-s protected-address"
    >
      <watt-icon size="s" name="warning" />
      <span class="watt-text-s">{{ t('protectedAddress') }}</span>
    </div>
  `,
})
export class DhCustomerProtectedComponent {}
