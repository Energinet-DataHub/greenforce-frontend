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
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { WattResizeObserverDirective } from '../../utils/resize-observer';
import { WattIconModule } from '../../foundations/icon';
import {
  WattModalComponent,
  WattModalActionsComponent,
} from './watt-modal.component';

@NgModule({
  declarations: [WattModalComponent, WattModalActionsComponent],
  exports: [WattModalComponent, WattModalActionsComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    WattResizeObserverDirective,
    WattIconModule,
  ],
})
export class WattModalModule {}
