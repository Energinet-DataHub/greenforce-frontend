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
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';

import { WattButtonModule } from '../button';
import { WattSpinnerModule } from '../spinner';
import { WattDrawerComponent } from './watt-drawer.component';
import { WattDrawerTopbarComponent } from './watt-drawer-topbar.component';
import { WattDrawerActionsComponent } from './watt-drawer-actions.component';
import { WattDrawerContentComponent } from './watt-drawer-content.component';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  declarations: [
    WattDrawerComponent,
    WattDrawerTopbarComponent,
    WattDrawerActionsComponent,
    WattDrawerContentComponent,
  ],
  exports: [
    WattDrawerComponent,
    WattDrawerTopbarComponent,
    WattDrawerActionsComponent,
    WattDrawerContentComponent,
  ],
  imports: [
    A11yModule,
    MatSidenavModule,
    WattButtonModule,
    WattSpinnerModule,
    CommonModule,
  ],
})
export class WattDrawerModule {}
