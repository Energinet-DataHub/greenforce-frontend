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
    `,
  ],
  template: `
    <mat-nav-list>
      <ng-container ettAuthenticationLink #link="ettAuthenticationLink">
        <a *rxLet="link.loginUrl$ as loginUrl" mat-list-item [href]="loginUrl"
          >NemID or MitID</a
        >
      </ng-container>
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
