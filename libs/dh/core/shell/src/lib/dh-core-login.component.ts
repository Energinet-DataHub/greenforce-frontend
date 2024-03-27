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
import { Component, inject } from '@angular/core';
import { MSALInstanceFactory } from '@energinet-datahub/dh/auth/msal';
import { dhB2CEnvironmentToken } from '@energinet-datahub/dh/shared/environments';

@Component({
  standalone: true,
  selector: 'dh-core-login',
  template: `
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <h2>Login</h2>
          <p>This is the login page</p>
          <button class="btn btn-primary" (click)="mitIdlogin()">Mit Id Login</button>
          <button class="btn btn-primary" (click)="login()">Login</button>
        </div>
      </div>
    </div>
  `,
})
export class DhCoreLoginComponent {
  private _config = inject(dhB2CEnvironmentToken);

  async mitIdlogin() {
    const instance = MSALInstanceFactory({
      ...this._config,
      authority: this._config.mitIdInviteFlowUri,
    });
    await instance.initialize();
    await instance.loginRedirect();
  }

  async login() {
    const instance = MSALInstanceFactory({
      ...this._config,
    });

    await instance.initialize();
    await instance.loginRedirect();
  }
}
