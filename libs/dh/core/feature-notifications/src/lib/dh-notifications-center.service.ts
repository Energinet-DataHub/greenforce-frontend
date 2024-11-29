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
