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
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'dh-metering-point-overview',
  imports: [TranslocoDirective],
  styles: `
    :host {
      display: block;
    }

    .page-header {
      background-color: var(--watt-color-neutral-white);
      padding: var(--watt-space-m) var(--watt-space-ml);

      h2 {
        margin: 0;
      }
    }
  `,
  template: `
    <div *transloco="let t; read: 'meteringPoint.overview'" class="page-header">
      <h2>{{ meteringPointId() }}</h2>
    </div>
  `,
})
export class DhMeteringPointOverviewComponent {
  meteringPointId = input.required<string>();
}
