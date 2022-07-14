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
import { WattDrawerContentDirective } from './watt-drawer-content.directive';
import { WattDrawerTopBarDirective } from './watt-drawer-top-bar.directive';
import { WattDrawerCloseOnEscDirective } from './watt-drawer-close-on-esc.directive';
import { WattDrawerComponent } from './watt-drawer.component';

@NgModule({
  declarations: [
    WattDrawerComponent,
    WattDrawerTopBarDirective,
    WattDrawerContentDirective,
    WattDrawerCloseOnEscDirective,
  ],
  exports: [
    WattDrawerComponent,
    WattDrawerTopBarDirective,
    WattDrawerContentDirective,
  ],
  imports: [MatSidenavModule, WattButtonModule, CommonModule],
})
export class WattDrawerModule {}
