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
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Intentionally use full product name prefix for the root component
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'energy-overview-app',
  styles: [
    ``,
  ],
  template: `<router-outlet />`,
  standalone: true,
  imports: [
    RouterOutlet,
  ],
})
export class EnergyOverviewAppComponent {
  // constructor(private authService: EoAuthService) {
  //   this.authService.checkForExistingToken();
  // }
}
