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

const selector = 'eo-scroll-view';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  template: `
    <div>
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      ${selector} {
        display: block;
        padding: calc(4 * var(--watt-space-xs));
        background: var(--watt-color-neutral-white);
        border-radius: var(--watt-space-xs);
        word-break: break-word;

        // This is the contents of the privacy policy with the custom scrollbar
        > div {
          max-height: calc(100 * var(--watt-space-xs));
          word-break: break-word;
          overflow-y: scroll;
          padding-right: calc(4 * var(--watt-space-xs));
          &::-webkit-scrollbar {
            width: 6px;
          }
          &::-webkit-scrollbar-track {
            background: var(--watt-color-neutral-white);
            border-radius: 50px;
          }
          &::-webkit-scrollbar-thumb {
            background-color: var(--watt-color-primary);
            border-radius: 50px;
          }
        }
      }
    `,
  ],
})
export class EoScrollViewComponent {}

@NgModule({
  declarations: [EoScrollViewComponent],
  exports: [EoScrollViewComponent],
})
export class EoScrollViewScam {}
