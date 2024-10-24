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
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const selector = 'eo-scroll-view';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      :root {
        --eo-scroll-view-padding: var(--watt-space-m);
        --eo-scroll-view-max-height: calc(100vh - 300px);
      }

      ${selector} {
        display: block;
        word-break: break-word;
        padding: var(--eo-scroll-view-padding);
        background: var(--watt-color-neutral-white);
        border-radius: var(--watt-space-xs);
      }

      // This is the contents of the privacy policy with the custom scrollbar
      ${selector} .content {
        max-height: var(--eo-scroll-view-max-height);
        word-break: break-word;
        overflow-y: scroll;
        padding-right: var(--watt-space-m);

        // As we do not have sufficient styling options for the scrollbar in Firefox - We are targeting webkit only
        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-thumb,
        &::-webkit-scrollbar-track {
          border-radius: 50px;
        }

        &::-webkit-scrollbar-track {
          background: var(--watt-color-neutral-white);
        }

        &::-webkit-scrollbar-thumb {
          background-color: var(--watt-color-primary);
        }
      }
    `,
  ],
  template: `
    <div class="content">
      <ng-content />
    </div>
  `,
})
export class EoScrollViewComponent {}
