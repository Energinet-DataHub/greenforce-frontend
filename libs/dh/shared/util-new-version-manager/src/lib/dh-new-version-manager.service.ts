import { inject, Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { TranslocoService } from '@ngneat/transloco';
import { filter } from 'rxjs';

import { WattToastService } from '@energinet-datahub/watt/toast';

@Injectable({
  providedIn: 'root',
})
export class DhNewVersionManager {
  private readonly swUpdate = inject(SwUpdate);
  private readonly toast = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);

  private readonly twoHours = 1000 * 60 * 60 * 2;

  init() {
    this.swUpdate.versionUpdates
      .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
      .subscribe(() => {
        this.toast.open({
          type: 'info',
          message: this.transloco.translate('newVersionAvailable.message'),
          actionLabel: this.transloco.translate('newVersionAvailable.action'),
          action: () => window.location.reload(),
          duration: this.twoHours,
        });
      });
  }
}
