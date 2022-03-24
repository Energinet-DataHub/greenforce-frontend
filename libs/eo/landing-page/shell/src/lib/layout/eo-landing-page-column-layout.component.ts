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
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';

export type LayoutType = 'full' | 'smallFirst' | 'largeFirst';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-landing-page-column-layout',
  styles: [
    `
      :host {
        display: block;
      }

      .display-flex {
        display: flex;
        align-items: center;
      }

      .content {
        // This is the rows which contain either on or two columns
        position: relative;
        max-width: var(--eo-landing-page-content-max-width);
        margin: 0 auto;
      }

      .column--large {
        width: 560px;
        display: inline-block;
      }

      .column--small {
        width: 400px;
        display: inline-block;
      }
    `,
  ],
  template: `
    <ng-container [ngSwitch]="layoutType">
      <div *ngSwitchCase="'full'" class="content">
        <ng-content></ng-content>
      </div>

      <div *ngSwitchCase="'smallFirst'" class="content display-flex">
        <div class="column--small">
          <ng-content select="[contentLeftSmall]"></ng-content>
        </div>

        <div class="column--large">
          <ng-content select="[contentRightLarge]"></ng-content>
        </div>
      </div>

      <div *ngSwitchCase="'largeFirst'" class="content display-flex">
        <div class="column--large">
          <ng-content select="[contentLeftLarge]"></ng-content>
        </div>

        <div class="column--small">
          <ng-content select="[contentRightSmall]"></ng-content>
        </div>
      </div>
    </ng-container>
  `,
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
