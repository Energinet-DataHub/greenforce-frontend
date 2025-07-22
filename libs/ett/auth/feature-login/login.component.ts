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
import { Component, inject, OnInit } from '@angular/core';
import { EttAuthService } from '@energinet-datahub/ett/auth/data-access';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

@Component({
  selector: 'ett-login',
  imports: [WattSpinnerComponent],
  styles: [
    `
      .spinner {
        display: flex;
        height: 100vh;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
  template: `<div class="spinner"><watt-spinner /></div>`,
})
export class EttLoginComponent implements OnInit {
  private readonly authService: EttAuthService = inject(EttAuthService);

  ngOnInit(): void {
    this.authService.login();
  }
}
