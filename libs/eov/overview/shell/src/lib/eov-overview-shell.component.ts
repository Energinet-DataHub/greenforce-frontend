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
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EovOverviewStore } from '@energinet-datahub/eov/overview/data-access-api';
import {
  MeteringPointsOverviewComponent
} from './metering-points-overview/metering-points-overview.component';
import {
  AuthorizationsOverviewComponent
} from './authorizations-overview/authorizations-overview.component';
import { AsyncPipe } from '@angular/common';
import { ConsentOverviewComponent } from './consent-overview/consent-overview.component';
import { TokenOverviewComponent } from './token-overview/token-overview.component';

@Component({
    selector: 'eov-overview-shell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './eov-overview-shell.component.scss',
    standalone: true,
    templateUrl: './eov-overview-shell.component.html',
  imports: [
    MeteringPointsOverviewComponent,
    AuthorizationsOverviewComponent,
    AsyncPipe,
    ConsentOverviewComponent,
    TokenOverviewComponent,

  ],
})
export class EovOverviewShellComponent {
  store = inject(EovOverviewStore);
  username$ = this.store.username$;
}
