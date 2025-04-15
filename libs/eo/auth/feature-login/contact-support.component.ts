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
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { WindTurbineComponent } from './wind-turbine.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-contact-support',
  standalone: true,
  imports: [RouterModule, TranslocoPipe, WindTurbineComponent],
  styles: [
    `
      eo-contact-support li {
        margin-bottom: var(--watt-space-m);
      }
      .support-block {
        margin-top: var(--watt-space-l);
        margin-left: var(--watt-space-m);
        text-align: left;
        max-width: 40rem;
        overflow-wrap: break-word;
      }
      .support-block h2 {
        margin-top: 0;
      }
      .support-block p {
        margin-top: var(--watt-space-m);
      }
    `,
  ],
  template: `
    <div class="support-block">
      <h2>{{ 'shared.notWhitelistedError.title' | transloco }}</h2>
      <p>{{ 'shared.notWhitelistedError.message' | transloco }}</p>

      <eo-wind-turbine [height]="300" [width]="200" [rotationSpeed]="5" />
    </div>
  `,
})
export class ContactSupportComponent {
  private transloco = inject(TranslocoService);
}
