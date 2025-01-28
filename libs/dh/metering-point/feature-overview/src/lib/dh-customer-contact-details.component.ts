import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { DhActualAddressComponent } from './dh-actual-address.component';

@Component({
  selector: 'dh-customer-contact-details',
  imports: [
    TranslocoDirective,

    WATT_MODAL,
    WattButtonComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    DhActualAddressComponent,
    DhEmDashFallbackPipe,
  ],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <watt-modal
      *transloco="let t; read: 'meteringPoint.overview.customerContactDetails'"
      [title]="t('title')"
      #modal
    >
      <watt-description-list variant="stack" [itemSeparators]="false">
        <watt-description-list-item [label]="t('name')" [value]="null | dhEmDashFallback" />
        <watt-description-list-item [label]="t('phone')" [value]="null | dhEmDashFallback" />
        <watt-description-list-item [label]="t('email')" [value]="null | dhEmDashFallback" />
        <watt-description-list-item [label]="t('addressLabel')" [value]="null | dhEmDashFallback" />
        <watt-description-list-item [label]="t('country')" [value]="null | dhEmDashFallback" />
        <watt-description-list-item [label]="t('streetCode')" [value]="null | dhEmDashFallback" />
        <watt-description-list-item [label]="t('postDistrict')" [value]="null | dhEmDashFallback" />
        <watt-description-list-item [label]="t('postBox')" [value]="null | dhEmDashFallback" />
        <watt-description-list-item
          [label]="t('municipalityCode')"
          [value]="null | dhEmDashFallback"
        />
        <watt-description-list-item [label]="t('darID')" [value]="null | dhEmDashFallback" />
      </watt-description-list>

      <dh-actual-address [isActualAddress]="true" />
      <dh-actual-address [isActualAddress]="false" />

      <watt-modal-actions>
        <watt-button (click)="modal.close(false)" variant="secondary">
          {{ t('closeButton') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhCustomerContactDetailsComponent extends WattTypedModal {}
