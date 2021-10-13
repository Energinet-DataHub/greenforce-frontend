import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { EttLoginProvidersScam } from './ett-login-providers.component';

/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
const selector = 'ett-onboarding-shell';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      ${selector} {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }
    `,
  ],
  template: `
    <mat-card role="region">
      <mat-card-title>
        <h1>Energy Track and Trace</h1>
      </mat-card-title>
      <mat-card-content>
        <p>Log in using:</p>

        <ett-login-providers></ett-login-providers>
      </mat-card-content>
    </mat-card>
  `,
})
export class EttOnboardingShellComponent {}

@NgModule({
  declarations: [EttOnboardingShellComponent],
  imports: [MatCardModule, EttLoginProvidersScam],
})
export class EttOnboardingShellScam {}
