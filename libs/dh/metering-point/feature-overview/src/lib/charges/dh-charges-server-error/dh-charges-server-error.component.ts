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
import { Component, NgModule } from '@angular/core';
import { WattEmptyStateModule } from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'dh-charges-server-error',
  templateUrl: './dh-charges-server-error.component.html',
  styleUrls: ['./dh-charges-server-error.component.scss'],
})
export class DhChargesServerErrorComponent {}

@NgModule({
  imports: [TranslocoModule, CommonModule, WattEmptyStateModule],
  declarations: [DhChargesServerErrorComponent],
  exports: [DhChargesServerErrorComponent],
})
export class DhChargesServerErrorScam {}
