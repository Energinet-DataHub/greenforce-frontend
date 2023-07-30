import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { PushModule } from '@rx-angular/template/push';

import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCopyToClipboardDirective } from '@energinet-datahub/watt/clipboard';
import { WattInputDirective } from '@energinet-datahub/watt/input';

import { EoTransfersStore } from './eo-transfers.store';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-transfers-wallet-modal',
  imports: [
    NgIf,
    PushModule,
    WATT_FORM_FIELD,
    WATT_MODAL,
    WattButtonComponent,
    WattCopyToClipboardDirective,
    WattInputDirective,
    WattEmptyStateComponent,
  ],
  standalone: true,
  template: `
    <watt-modal
      #modal
      title="Create Wallet Deposit Endpoint"
      [loading]="loading"
      loadingMessage="Please wait while we generate your key"
      size="small"
      closeLabel="Close modal"
      (closed)="onClosed()"
      *ngIf="opened"
    >
      <form *ngIf="!(walletDepositEndpointError$ | push); else error" style="min-height: 416px;">
        <p>
          To receive granular certificates the sender must create a transfer agreement. They need
          this key to identify the recipient (you).
        </p>
        <p style="margin-top: var(--watt-space-s);">
          <strong>The key is one-time use only</strong>
        </p>
        <div style="display: flex; align-items: center; margin: var(--watt-space-xl) 0;">
          <watt-form-field>
            <watt-label>KEY</watt-label>
            <input wattInput type="text" [value]="(walletDepositEndpoint$ | push) || ''" #key />
          </watt-form-field>
          <watt-button variant="text" icon="contentCopy" [wattCopyToClipboard]="key.value"
            >Copy key</watt-button
          >
        </div>
      </form>
    </watt-modal>

    <ng-template #error>
      <watt-empty-state icon="power" title="An unexpected error occured" message="We're sorry, we couldn't generate your key. Please try again later." style="margin: var(--watt-space-xl) 0;">
      </watt-empty-state>
    </ng-template>
  `,
})
export class EoTransfersWalletModalComponent {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  private cd = inject(ChangeDetectorRef);
  private store = inject(EoTransfersStore);

  protected opened = false;
  protected walletDepositEndpoint$ = this.store.walletDepositEndpoint$;
  protected walletDepositEndpointError$ = this.store.walletDepositEndpointError$;
  protected walletDepositEndpointLoading$ = this.store.walletDepositEndpointLoading$;
  loading = false;

  open() {
    this.opened = true;
    this.cd.detectChanges();
    this.modal.open();
    this.createWalletDepositEndpoint();

    this.walletDepositEndpointLoading$.subscribe((loading) => {
      this.loading = loading;
    });
  }

  onClosed() {
    this.opened = false;
  }

  createWalletDepositEndpoint() {
    this.store.createWalletDepositEndpoint();
  }
}
