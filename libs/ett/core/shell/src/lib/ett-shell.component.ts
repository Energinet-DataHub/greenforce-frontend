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
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { WattShellModule } from '@energinet-datahub/watt';

import { EttPrimaryNavigationScam } from './ett-primary-navigation.component';
import { EttUserScam } from './ett-user.component';

const selector = 'ett-shell';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      ${selector} {
        display: block;
      }

      ${selector}__toolbar {
        width: 100%;
        display: flex;

        h1 {
          flex: auto;
        }

        .menu {
          align-self: flex-end;
        }
      }
    `,
  ],
  template: `
    <watt-shell>
      <ng-container watt-shell-sidenav>
        <ett-primary-navigation></ett-primary-navigation>
      </ng-container>

      <ng-container watt-shell-toolbar>
        <div class="${selector}__toolbar">
          <h1>Energy Origin</h1>

          <div class="menu">
            <ett-user></ett-user>
          </div>
        </div>
      </ng-container>

      <router-outlet></router-outlet>
    </watt-shell>
  `,
})
export class EttShellComponent {}

@NgModule({
  declarations: [EttShellComponent],
  imports: [
    CommonModule,
    RouterModule,
    WattShellModule,
    EttPrimaryNavigationScam,
    EttUserScam,
  ],
})
export class EttShellScam {}
