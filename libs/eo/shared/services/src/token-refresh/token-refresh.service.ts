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
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { combineLatest, Subscription, switchMap, timer } from 'rxjs';
import { EoAuthService } from '../auth/auth.service';
import { EoAuthStore } from '../auth/auth.store';

@Injectable({
  providedIn: 'root',
})
export class TokenRefreshService {
  subscription$: Subscription | undefined;

  constructor(private store: EoAuthStore, private authService: EoAuthService) {}

  startMonitor() {
    this.subscription$ = timer(0, 5000)
      .pipe(
        switchMap(() =>
          combineLatest({ exp: this.store.getTokenExpiry$, iat: this.store.getTokenIssuedAt$ })
        )
      )
      .subscribe(({ exp, iat }) => this.whenTimeThresholdReached(exp, iat));
  }

  stopMonitor() {
    this.subscription$?.unsubscribe();
  }

  whenTimeThresholdReached(exp: number, iat: number) {
    const totalTime = exp - iat;
    const twentyPercent = totalTime * 0.2;
    const remainingTime = exp - Date.now() / 1000;
    if (remainingTime < twentyPercent) {
      this.authService.refreshToken();
    }
  }
}
