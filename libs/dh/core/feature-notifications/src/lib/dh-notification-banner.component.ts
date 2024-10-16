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
import { HotToastRef } from '@ngxpert/hot-toast';

type BannerDataType = {
  headline: string;
  message: string;
};

@Component({
  selector: 'dh-notification-banner',
  standalone: true,
  styles: `
    :host {
      display: block;
    }

    p {
      margin: 0;
    }
  `,
  template: `
    <h5 class="watt-space-stack-xxs">{{ toastRef.data.headline }}</h5>
    <p>{{ toastRef.data.message }}</p>
  `,
})
export class DhNotificationBannerComponent {
  public toastRef = inject<HotToastRef<BannerDataType>>(HotToastRef);
}
