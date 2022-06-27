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
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-scroll-view',
  styles: [
    `
      :host {
        display: block;
        word-break: break-word;

        padding: var(--watt-space-m);

        background: var(--watt-color-neutral-white);
        border-radius: var(--watt-space-xs);
      }

      // This is the contents of the privacy policy with the custom scrollbar
      .content {
        max-height: calc(100vh - 470px); // Magic number by designer
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
      <ng-content></ng-content>
    </div>
  `,
})
export class EoScrollViewComponent {}

@NgModule({
  declarations: [EoScrollViewComponent],
  exports: [EoScrollViewComponent],
})
export class EoScrollViewScam {}
