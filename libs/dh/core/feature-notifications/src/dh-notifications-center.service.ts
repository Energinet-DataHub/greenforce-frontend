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
import { createEnvironmentInjector, EnvironmentInjector, inject, Injectable } from '@angular/core';
import type { HotToastService } from '@ngxpert/hot-toast';

import { WattColorHelperService } from '@energinet/watt/core/color';

import { DhNotification } from './dh-notification';

@Injectable({
  providedIn: 'root',
})
export class DhNotificationsCenterService {
  private readonly injector = inject(EnvironmentInjector);
  private readonly colorService = inject(WattColorHelperService);

  private hotToast: Promise<HotToastService> | null = null;

  async showBanner(notification: DhNotification): Promise<void> {
    const [hotToast, { DhNotificationBannerComponent }] = await Promise.all([
      this.loadHotToast(),
      import('./dh-notification-banner.component'),
    ]);

    hotToast.show<DhNotification>(DhNotificationBannerComponent, {
      data: { ...notification },
      position: 'top-right',
      dismissible: true,
      autoClose: true,
      duration: 5_000,
      style: {
        border: `1px solid ${this.colorService.getColor('grey400')}`,
        'backdrop-filter': 'blur(30px)',
      },
      closeStyle: {
        position: 'absolute',
        left: '-10px',
        top: '-10px',
      },
    });
  }

  private loadHotToast(): Promise<HotToastService> {
    if (!this.hotToast) {
      this.hotToast = (async () => {
        const { HotToastService, provideHotToastConfig } = await import('@ngxpert/hot-toast');
        const childInjector = createEnvironmentInjector(
          [provideHotToastConfig()],
          this.injector,
          'HotToast'
        );
        return childInjector.get(HotToastService);
      })();
    }
    return this.hotToast;
  }
}
