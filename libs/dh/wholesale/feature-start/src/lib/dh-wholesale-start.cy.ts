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
