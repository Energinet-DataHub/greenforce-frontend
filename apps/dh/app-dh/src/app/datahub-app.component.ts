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
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'dh-app',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `<router-outlet />`,
  standalone: true,
  imports: [RouterOutlet],
})
export class DataHubAppComponent implements OnInit {
  private _authService = inject(MsalService);
  private _router = inject(Router);

  ngOnInit(): void {
    this._authService.handleRedirectObservable().subscribe((data) => {
      if (data) {
        this._authService.instance.setActiveAccount(data.account);
        this._router.navigate(['']);
      }
    });
  }
}
