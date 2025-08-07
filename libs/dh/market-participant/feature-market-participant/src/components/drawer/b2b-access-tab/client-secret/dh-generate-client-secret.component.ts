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
import { Component, input, inject, output } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhMarketPartyB2BAccessStore } from '../dh-b2b-access.store';
import { DhMarketParticipantAuditLogService } from '../../dh-actor-audit-log.service';

@Component({
  selector: 'dh-generate-client-secret',
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
  private readonly auditLogService = inject(DhMarketParticipantAuditLogService);

  generateSecretInProgress = this.store.generateSecretInProgress;
  doesClientSecretMetadataExist = this.store.doesClientSecretMetadataExist;

  marketParticipantId = input.required<string>();

  generateSuccess = output<void>();

  generateSecret(): void {
    this.store.generateClientSecret({
      marketParticipantId: this.marketParticipantId(),
      onSuccess: this.onGenerateSecretSuccessFn,
      onError: this.onGenerateSecretErrorFn,
    });
  }

  private onGenerateSecretSuccessFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.generateSecretSuccess'
    );

    this.toastService.open({ type: 'success', message });

    this.generateSuccess.emit();
    this.store.getCredentials(this.marketParticipantId());
    this.auditLogService.refreshAuditLog(this.marketParticipantId());
  };

  private onGenerateSecretErrorFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.generateSecretError'
    );

    this.toastService.open({ type: 'danger', message });
  };
}
