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
import { inject, Injectable } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';

import { WattColor, WattColorHelperService } from '@energinet-datahub/watt/color';

import { DhNotification } from './dh-notification';
import { DhNotificationBannerComponent } from './dh-notification-banner.component';

@Injectable({
  providedIn: 'root',
})
export class DhNotificationsCenterService {
  private readonly hotToast = inject(HotToastService);
  private readonly colorService = inject(WattColorHelperService);

  showBanner(notification: DhNotification): void {
    this.hotToast.show<DhNotification>(DhNotificationBannerComponent, {
      data: {
        ...notification,
      },
      position: 'top-right',
      dismissible: true,
      autoClose: false,
      style: {
        border: `1px solid ${this.colorService.getColor(WattColor.grey400)}`,
        'backdrop-filter': 'blur(30px)',
      },
      closeStyle: {
        position: 'absolute',
        left: '-10px',
        top: '-10px',
      },
    });
  }
}
