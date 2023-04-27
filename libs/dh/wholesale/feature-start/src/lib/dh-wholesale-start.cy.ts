import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { WattDanishDatetimeModule } from '@energinet-datahub/watt/danish-date-time';

import { WattToastModule } from '@energinet-datahub/watt/toast';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { DhGraphQLModule } from '@energinet-datahub/dh/shared/data-access-graphql';
import {
  DhConfigurationLocalizationModule,
  DhTranslocoModule,
} from '@energinet-datahub/dh/globalization/configuration-localization';

import { DhWholesaleStartComponent } from './dh-wholesale-start.component';

beforeEach(() => {
  cy.request('/__cypress/src/assets/msw/mockServiceWorker.js').then((res) => {
    cy.intercept('/mockServiceWorker.js', {
      headers: { 'content-type': 'text/javascript' },
      body: res.body,
    });
  });

  cy.intercept('/assets/i18n/da.json', { hostname: 'localhost' }, (req) => {
    req.redirect('/__cypress/src/assets/i18n/da.json');
  });
});

it('mounts', () => {
  cy.mount(DhWholesaleStartComponent, {
    imports: [
      BrowserAnimationsModule,
      DhApiModule.forRoot(),
      DhConfigurationLocalizationModule.forRoot(),
      DhGraphQLModule.forRoot(),
      DhTranslocoModule.forRoot(),
      HttpClientModule,
      WattDanishDatetimeModule.forRoot(),
      WattToastModule.forRoot(),
    ],
  });
});
