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

import { EoLandingPageShellHeaderModule } from './header/eo-landing-page-shell-header.module';

const selector = 'eo-landingpage-shell';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      ${selector} {
      }
    `,
  ],
  template: `
    <eo-landingpage-shell-header></eo-landingpage-shell-header>
  `,
})
export class EoLandingPageShellComponent {
}

@NgModule({
  declarations: [EoLandingPageShellComponent],
  imports: [
    EoLandingPageShellHeaderModule
  ]
})
export class EoLandingPageShellScam {}
