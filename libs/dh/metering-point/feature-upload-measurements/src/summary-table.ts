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
import { Component, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'dh-upload-measurements-summary-table',
  imports: [TranslocoDirective],
  styles: `
    @use '@energinet/watt/utils' as watt;

    table {
      width: 100%;
      border-collapse: collapse;

      & tr {
        height: 44px;
      }

      & th {
        text-align: left;
        padding-left: var(--watt-space-m);
      }

      & td {
        text-align: right;
        padding-right: var(--watt-space-m);
      }

      & th {
        @include watt.typography-watt-label;
      }

      & tfoot tr {
        background: var(--watt-color-primary-ultralight);
      }

      & tfoot td {
        @include watt.typography-font-weight('semi-bold');
      }
    }
  `,
  template: `
    <table *transloco="let t; prefix: 'meteringPoint.measurements'">
      <tbody>
        <tr>
          <th>{{ t('upload.table.positionCount') }}</th>
          <td>{{ positions() }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th>{{ t('upload.table.sum') }}</th>
          <td>{{ sum() }}</td>
        </tr>
      </tfoot>
    </table>
  `,
})
export class DhUploadMeasurementsSummaryTable {
  readonly positions = input.required<number>();
  readonly sum = input.required<number>();
}
