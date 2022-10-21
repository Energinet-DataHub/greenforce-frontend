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
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

import {
  dhMeteringPointSearchPath,
  dhMeteringPointPath,
} from '@energinet-datahub/dh/metering-point/routing';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattButtonModule } from '@energinet-datahub/watt/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-not-found',
  templateUrl: './dh-metering-point-not-found.component.html',
})
export class DhMeteringPointNotFoundComponent {
  constructor(private router: Router) {}

  goToSearch(): void {
    const url = this.router.createUrlTree([
      dhMeteringPointPath,
      dhMeteringPointSearchPath,
    ]);

    this.router.navigateByUrl(url);
  }
}

@NgModule({
  declarations: [DhMeteringPointNotFoundComponent],
  exports: [DhMeteringPointNotFoundComponent],
  imports: [TranslocoModule, WattButtonModule, WattEmptyStateModule],
})
export class DhMeteringPointNotFoundScam {}
