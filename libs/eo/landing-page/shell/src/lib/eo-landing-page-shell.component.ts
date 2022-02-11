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
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LetModule } from '@rx-angular/template';
import { EoLandingPageHeaderScam } from './eo-landing-page-header.component';
import { EoFooterScam } from '@energinet-datahub/eo/shared/ui-page-templates';
import { EoLandingPageStore } from './eo-landing-page.store';

const selector = 'eo-landing-page-shell';

@Component({
  providers: [EoLandingPageStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      ${selector} {
        display: block;
      }
    `,
  ],
  template: `
    <eo-landing-page-header></eo-landing-page-header>
    <eo-footer></eo-footer>
  `,
})
export class EoLandingPageShellComponent {}

@NgModule({
  declarations: [EoLandingPageShellComponent],
  imports: [MatButtonModule, LetModule, EoLandingPageHeaderScam, EoFooterScam],
})
export class EoLandingPageShellScam {}
