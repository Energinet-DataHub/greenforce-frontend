//#region License
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
//#endregion
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

@Component({
  selector: 'ett-onboarding-shell',
  imports: [WattSpinnerComponent],
  styles: `
    :host {
      height: 100vh;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `,
  template: ` <watt-spinner /> `,
})
export class EttOnboardingShellComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  clientId: string | null = null;

  ngOnInit() {
    const thirdPartyClientId = this.route.snapshot.queryParamMap.get('client-id');
    const redirectUrl = this.route.snapshot.queryParamMap.get('redirect-url');

    if (!thirdPartyClientId) return;

    this.router.navigate(['/consent'], {
      queryParams: {
        'third-party-client-id': thirdPartyClientId,
        'redirect-url': redirectUrl,
      },
    });
  }
}
