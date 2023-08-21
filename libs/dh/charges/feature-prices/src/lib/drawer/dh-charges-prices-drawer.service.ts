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
import { Injectable } from '@angular/core';
import { ChargeMessageV1Dto } from '@energinet-datahub/dh/shared/domain';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DhChargesPricesDrawerService {
  defaultChargeMessageV1Dto?: ChargeMessageV1Dto = undefined;

  private message$ = new BehaviorSubject(this.defaultChargeMessageV1Dto);
  message = this.message$.asObservable();

  reset() {
    this.message$.next(undefined);
  }

  setMessage(message: ChargeMessageV1Dto) {
    this.message$.next(message);
  }

  removeMessage() {
    this.message$.next(undefined);
  }
}
