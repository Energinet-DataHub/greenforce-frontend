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
import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { DhMarketPartyB2BAccessStore } from '@energinet-datahub/dh/market-participant/actors/data-access-api';

@Component({
  selector: 'dh-generate-client-secret',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `<watt-button
    *transloco="let t; read: 'marketParticipant.actorsOverview.drawer.tabs.b2bAccess'"
    (click)="generateSecret()"
    [loading]="generateSecretInProgress()"
    variant="secondary"
    >{{
      doesClientSecretMetadataExist() ? t('generateNewClientSecret') : t('generateClientSecret')
    }}</watt-button
  >`,
  imports: [TranslocoDirective, WattButtonComponent],
})
export class DhGenerateClientSecretComponent {
  private readonly transloco = inject(TranslocoService);
  private readonly toastService = inject(WattToastService);
  private readonly store = inject(DhMarketPartyB2BAccessStore);

  generateSecretInProgress = toSignal(this.store.generateSecretInProgress$, {
    requireSync: true,
  });
  doesClientSecretMetadataExist = toSignal(this.store.doesClientSecretMetadataExist$);

  @Input({ required: true }) actorId = '';

  @Output() uploadSuccess = new EventEmitter<void>();

  generateSecret(): void {
    this.store.generateClientSecret({
      actorId: this.actorId,
      onSuccess: this.onGenerateSecretSuccessFn,
      onError: this.onGenerateSecretErrorFn,
    });
  }

  private onGenerateSecretSuccessFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.generateSecretSuccess'
    );

    this.toastService.open({ type: 'success', message });

    this.uploadSuccess.emit();
    this.store.getCredentials(this.actorId);
  };

  private onGenerateSecretErrorFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.generateSecretError'
    );

    this.toastService.open({ type: 'danger', message });
  };
}
