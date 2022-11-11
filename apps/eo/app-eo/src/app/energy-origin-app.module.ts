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
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EoCoreShellModule } from '@energinet-datahub/eo/core/shell';
import { EnergyOriginAppComponent } from './energy-origin-app.component';

@NgModule({
  bootstrap: [EnergyOriginAppComponent],
  declarations: [EnergyOriginAppComponent],
  imports: [
    RouterModule,
    BrowserAnimationsModule,
    EoCoreShellModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class EnergyOriginAppModule {}
