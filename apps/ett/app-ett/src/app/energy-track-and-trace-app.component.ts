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
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';

const selector = 'ett-app';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      ${selector} {
        display: block;
        min-height: 100%;
      }
    `,
  ],
  template: `<router-outlet></router-outlet>`,
})
export class EnergyTrackAndTraceAppComponent {
  @HostBinding('className')
  className = 'mat-app-background';
}

@NgModule({
  declarations: [EnergyTrackAndTraceAppComponent],
  imports: [RouterModule],
})
export class EnergyTrackAndTraceAppScam {}
