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
  Component,
  NgModule,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  EoLandingPageColumnLayoutScam,
  layoutTypeEnum,
} from './eo-landing-page-column-layout.component';
import { EoLandingPageLogInButtonScam } from './eo-landing-page-login-button.component';

const selector = 'eo-landing-page-top-layout';

@Component({
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      ${selector} {
        display: block;
        margin-top: var(--watt-space-xl);

        .${selector}__h1 {
          @include watt.typography-watt-headline-1; // This overrides the styles applied from Angular Material on h1 tags

          > span {
            color: var(--watt-color-primary);
          }
        }

        .${selector}__h2 {
          @include watt.typography-watt-headline-2; // This overrides the styles applied from Angular Material on h2 tags
          text-transform: none; // This overrides the uppercased styling from watt
          text-align: center;
        }
      }
    `,
  ],
  template: `
    <eo-landing-page-column-layout [layoutType]="layoutTypeEnum.LARGE_FIRST">
      <ng-container contentLeftLarge>
        <h1 class="${selector}__h1">
          Access
          <span class="font-primary-color"
            >your emissions and<br />energy origin</span
          >
          overview
        </h1>
        <div style="height: 403px; background: #ccc;">
          <!-- -- Placeholder for Image -- -->
        </div>
      </ng-container>
      <ng-container contentRightSmall>
        <h2 class="${selector}__h2">Log in with your commercial NemID</h2>
        <eo-landing-page-login-button
          class="eo-text-center"
        ></eo-landing-page-login-button>
      </ng-container>
    </eo-landing-page-column-layout>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoLandingPageTopLayoutComponent {
  layoutTypeEnum = layoutTypeEnum;
}

@NgModule({
  declarations: [EoLandingPageTopLayoutComponent],
  exports: [EoLandingPageTopLayoutComponent],
  imports: [EoLandingPageColumnLayoutScam, EoLandingPageLogInButtonScam],
})
export class EoLandingPageTopLayoutScam {}
