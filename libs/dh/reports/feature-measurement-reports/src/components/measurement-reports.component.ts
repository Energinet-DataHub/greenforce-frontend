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
import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WATT_CARD } from '@energinet-datahub/watt/card';

@Component({
  selector: 'dh-measurement-reports',
  imports: [TranslocoDirective, WATT_CARD, VaterUtilityDirective],
  styles: `
    :host {
      display: block;
    }

    h3 {
      margin: 0;
    }
  `,
  template: `
    <watt-card vater inset="ml" *transloco="let t; read: 'reports.measurementReports'" />
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhMeasurementReports {}
