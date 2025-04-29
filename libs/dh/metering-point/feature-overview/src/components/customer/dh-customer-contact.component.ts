import { Component, input } from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { CustomerContactDto } from '@energinet-datahub/dh/shared/domain/graphql';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

@Component({
  imports: [
    TranslocoDirective,

    WattDescriptionListComponent,
    WattDescriptionListItemComponent,

    DhEmDashFallbackPipe,
  ],
  selector: 'dh-customer-contact',
  template: `
    <watt-description-list
      *transloco="let t; read: 'meteringPoint.overview.customerContactDetails'"
      variant="stack"
      [itemSeparators]="false"
    >
      <watt-description-list-item [label]="t('name')" [value]="contact().name | dhEmDashFallback" />
      @if (contact().phone) {
        <watt-description-list-item [label]="t('phone')" [value]="contact().phone" />
      }
      @if (contact().mobile) {
        <watt-description-list-item
          [label]="contact().phone ? t('mobile') : t('phone')"
          [value]="contact().mobile"
        />
      }
      @if (!contact().phone && !contact().mobile) {
        <watt-description-list-item [label]="t('phone')" [value]="null | dhEmDashFallback" />
      }

      <watt-description-list-item
        [label]="t('email')"
        [value]="contact().email | dhEmDashFallback"
      />

      <watt-description-list-item [label]="t('address')">
        {{ contact().streetName | dhEmDashFallback }}

        @if (contact().buildingNumber) {
          {{ contact().buildingNumber | dhEmDashFallback }}
        }
      </watt-description-list-item>

      <watt-description-list-item
        [label]="t('postCodeAndCity')"
        [value]="
          (contact().postCode | dhEmDashFallback) + ' ' + (contact().cityName | dhEmDashFallback)
        "
      />

      <watt-description-list-item
        [label]="t('country')"
        [value]="contact().countryCode | dhEmDashFallback"
      />
      <watt-description-list-item
        [label]="t('streetCode')"
        [value]="contact().streetCode | dhEmDashFallback"
      />
      <watt-description-list-item
        [label]="t('postDistrict')"
        [value]="contact().citySubDivisionName | dhEmDashFallback"
      />
      <watt-description-list-item
        [label]="t('postBox')"
        [value]="contact().postBox | dhEmDashFallback"
      />
      <watt-description-list-item
        [label]="t('municipalityCode')"
        [value]="contact().municipalityCode | dhEmDashFallback"
      />
      <watt-description-list-item
        [label]="t('darID')"
        [value]="contact().darReference | dhEmDashFallback"
      />
    </watt-description-list>
  `,
})
export class DhCustomerContactComponent {
  contact = input.required<CustomerContactDto>();
}
