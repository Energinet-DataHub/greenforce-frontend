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
import { Component, NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ett-primary-navigation',
  styles: [':host { display: block; }'],
  template: `
    <mat-nav-list>
      <a mat-list-item routerLink="/dashboard" routerLinkActive="active"
        >Dashboard</a
      >
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
