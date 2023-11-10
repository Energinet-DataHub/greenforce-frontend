import { Component, Input, inject } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { DhMarketPartyCredentialsStore } from '@energinet-datahub/dh/market-participant/actors/data-access-api';

@Component({
  selector: 'dh-create-secret',
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
    variant="secondary"
    >{{ t('generateClientSecret') }}</watt-button
  >`,
  imports: [TranslocoDirective, WattButtonComponent],
})
export class DhCreateSecretComponent {
  private readonly transloco = inject(TranslocoService);
  private readonly toastService = inject(WattToastService);
  private readonly store = inject(DhMarketPartyCredentialsStore);

  @Input({ required: true }) actorId = '';

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

    this.store.getCredentials(this.actorId);
  };

  private onGenerateSecretErrorFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.generateSecretError'
    );

    this.toastService.open({ type: 'danger', message });
  };
}
