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
import { MatListModule } from '@angular/material/list';
import { LetModule } from '@rx-angular/template';

import { EttAuthenticationScam } from './ett-authentication-link.directive';

const selector = 'ett-login-providers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      ${selector} {
        display: block;
      }

      .${selector}__error.${selector}__error {
        margin: 0;
      }
    `,
  ],
  template: `
    <mat-nav-list>
      <mat-list-item>
        <ng-container ettAuthenticationLink #link="ettAuthenticationLink">
          <a
            *rxLet="link.loginUrl$ as loginUrl; rxError: loginError"
            [href]="loginUrl"
            >NemID or MitID</a
          >
          <ng-template #loginError let-error="$error">
            <p class="${selector}__error">
              NemID and MitID login is currently unavailable. Please try again
              later.
            </p>
          </ng-template>
        </ng-container>
      </mat-list-item>
    </mat-nav-list>
  `,
})
export class EttLoginProvidersComponent {}

@NgModule({
  declarations: [EttLoginProvidersComponent],
  exports: [EttLoginProvidersComponent],
  imports: [MatListModule, LetModule, EttAuthenticationScam],
})
export class EttLoginProvidersScam {}
