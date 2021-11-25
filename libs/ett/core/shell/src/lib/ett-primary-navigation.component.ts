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
import { RouterModule } from '@angular/router';

const selector = 'ett-primary-navigation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      ${selector} {
        display: block;

        mat-nav-list {
          color: white;
          font-weight: bold;
          border-left: transparent solid 10px;

          .active {
            border-left: #facf42 solid 10px;
          }
        }
      }
    `,
  ],
  template: `
    <mat-nav-list>
      <div mat-list-item>
        <img src="/assets/logo.png" style="width: 100%;">
      </div>
      <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
        Dashboard
      </a>
      <a mat-list-item routerLink="/facilities" routerLinkActive="active">
        Facilities
      </a>
      <a mat-list-item routerLink="/certificates" routerLinkActive="active">
        Certificates
      </a>
      <a mat-list-item routerLink="/support" routerLinkActive="active">
        Support
      </a>
    </mat-nav-list>
  `,
})
export class EttPrimaryNavigationComponent {}

@NgModule({
  declarations: [EttPrimaryNavigationComponent],
  exports: [EttPrimaryNavigationComponent],
  imports: [RouterModule, MatListModule],
})
export class EttPrimaryNavigationScam {}
