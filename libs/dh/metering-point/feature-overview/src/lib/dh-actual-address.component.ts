import { Component, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';

@Component({
  selector: 'dh-actual-address',
  imports: [TranslocoDirective, VaterFlexComponent, WattIconComponent],
  styles: `
    :host {
      display: block;
    }

    .actual-address-wrapper {
      align-items: center;
    }
  `,
  template: `
    <div
      *transloco="let t; read: 'meteringPoint.overview.addressDetails'"
      class="watt-text-s actual-address-wrapper"
      vater-flex
      direction="row"
      gap="s"
      grow="0"
    >
      @if (isActualAddress()) {
        <watt-icon name="location" state="success" size="s" />
        {{ t('actualAddress') }}
      } @else {
        <watt-icon name="wrongLocation" state="danger" size="s" />
        {{ t('notActualAddress') }}
      }
    </div>
  `,
})
export class DhActualAddressComponent {
  isActualAddress = input.required();
}
