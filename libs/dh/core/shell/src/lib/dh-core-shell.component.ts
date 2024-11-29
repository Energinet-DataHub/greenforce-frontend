import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { WattShellComponent } from '@energinet-datahub/watt/shell';

import { DhTopBarStore } from '@energinet-datahub/dh-shared-data-access-top-bar';
import { DhProfileAvatarComponent } from '@energinet-datahub/dh/profile/feature-avatar';
import {
  DhInactivityDetectionService,
  DhSelectedActorComponent,
} from '@energinet-datahub/dh/shared/feature-authorization';
import { DhNotificationsCenterComponent } from '@energinet-datahub/dh/core/feature-notifications';

import { DhPrimaryNavigationComponent } from './dh-primary-navigation.component';

@Component({
  selector: 'dh-shell',
  styleUrls: ['./dh-core-shell.component.scss'],
  templateUrl: './dh-core-shell.component.html',
  standalone: true,
  imports: [
    TranslocoPipe,
    RouterOutlet,

    WattShellComponent,

    DhPrimaryNavigationComponent,
    DhProfileAvatarComponent,
    DhSelectedActorComponent,
    DhNotificationsCenterComponent,
  ],
})
export class DhCoreShellComponent {
  private readonly dhTopBarStore = inject(DhTopBarStore);

  titleTranslationKey = toSignal(this.dhTopBarStore.titleTranslationKey$);

  constructor(inactivityDetection: DhInactivityDetectionService) {
    inactivityDetection.trackInactivity();
  }
}
