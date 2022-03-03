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
  Input,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';

import { CommonModule } from '@angular/common';

export type LayoutType = 'full' | 'smallFirst' | 'largeFirst';

const selector = 'eo-landing-page-column-layout';

@Component({
  selector,
  styles: [
    `
      ${selector} {
        display: block;
      }

      .${selector}__display-flex {
        display: flex;
        align-items: center;
      }

      .${selector}__content {
        // This is the rows which contain either on or two columns
        position: relative;
        max-width: 1280px; // Defined in Figma
        margin: 0 auto;
      }
      .${selector}__column--large {
        width: 60%;
        display: inline-block;
      }
      .${selector}__column--small {
        width: 40%;
        display: inline-block;
      }
    `,
  ],
  template: `
    <ng-container [ngSwitch]="layoutType">

      <div class="${selector}__content watt-space-inset-xl" *ngSwitchCase="'full'">
        <ng-content></ng-content>
      </div>

      <div class="${selector}__content ${selector}__display-flex" *ngSwitchCase="'smallFirst'">
        <div
          class="${selector}__column--small watt-space-inset-l eo-padding-left-none"
        >
          <ng-content select="[contentLeftSmall]"></ng-content>
        </div>
        <div class="${selector}__column--large">
          <ng-content select="[contentRightLarge]"></ng-content>
        </div>
      </div>

      <div class="${selector}__content ${selector}__display-flex" *ngSwitchCase="'largeFirst'">
        <div class="${selector}__column--large">
          <ng-content select="[contentLeftLarge]"></ng-content>
        </div>
        <div class="${selector}__column--small watt-space-inset-l">
          <ng-content select="[contentRightSmall]"></ng-content>
        </div>
      </div>

    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoLandingPageColumnLayoutComponent {
  @Input()
  layoutType: LayoutType = 'full';
}

@NgModule({
  declarations: [EoLandingPageColumnLayoutComponent],
  exports: [EoLandingPageColumnLayoutComponent],
  imports: [CommonModule],
})
export class EoLandingPageColumnLayoutScam {}
