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
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'eo-signin-callback',
  template: `<p>Processing signin callback</p>`,
  styles: '',
  standalone: true,
  imports: [],
})
export class EoSigninCallbackComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.authService.init();
    this.authService.userManager?.signinCallback().then(user => {
      const clientId = user?.state;
      console.log('client-id:', clientId);

      // ... rest of your code ...

      this.authService.getUser().then(user => {
        console.log('User:', user);
      });
    }).catch(err => {
      console.error('Error processing signin callback:', err);
    });
  }
}
