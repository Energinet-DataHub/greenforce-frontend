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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { LoginOverlayComponent } from '@energinet-datahub/eov/shared/feature-login';
import { WattTooltipDirective } from '@energinet-datahub/watt/tooltip';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    WattButtonComponent,
    WattTooltipDirective,
    LoginOverlayComponent,
    OverlayModule,
  ],
  selector: 'eov-landing-page-shell',
  templateUrl: './eov-landing-page-shell.component.html',
  styleUrls: ['./eov-landing-page-shell.component.scss']
})
export class EovLandingPageShellComponent {
  isLoginOverlayOpen = false;

  isLoginOverlayOpenChanged(isOpen: boolean) {
    this.isLoginOverlayOpen = isOpen;
  }

  openLoginOverlay() {
    this.isLoginOverlayOpen = true;
  }
}
