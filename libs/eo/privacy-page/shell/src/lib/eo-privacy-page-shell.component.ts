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


const selector = 'eo-privacy-page-shell';

@Component({
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
  template: `<h1>Hi from the privacy page</h1>`,
})
export class EoPrivacyPageShellComponent {}

@NgModule({
  declarations: [EoPrivacyPageShellComponent]
})
export class EoPrivacyPageShellScam {}
