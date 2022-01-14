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
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { WattButtonModule } from '@energinet-datahub/watt';
import { WattButtonVariant } from '@energinet-datahub/watt';

const selector = 'eo-landingpage-shell';

// @todo: Brug Angular material "top bar"

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      ${selector} {
        header {
          display: flex;
          justify-content: space-between;
          padding: 0 20px 0 20px;
          align-items: center;
          height: 64px;
          background: #fff;
        }
      }
    `,
  ],
  template: `
    <header>
      <nav>
        <img src="assets/energyorigin-logo.png" />
      </nav>
      <nav>
        <watt-button [variant]="buttonVariant">START</watt-button>
      </nav>
    </header>
  `,
})
export class EoLandingPageShellComponent {
  readonly buttonVariant: WattButtonVariant = 'primary';
  constructor() {}

  // @todo: Create logic that creates the link to auth (own backend)
  // ...
}

// @todo: JAN K -> Forstå denne her export(?)
@NgModule({
  declarations: [EoLandingPageShellComponent],
  imports: [WattButtonModule], // Import modules used in this view here
})
export class EoLandingPageShellScam {}
