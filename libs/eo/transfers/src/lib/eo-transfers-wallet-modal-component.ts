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
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-(walletDepositEndpointError$ | async) === falsee law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ChangeDetectorRef, Component, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormControl } from '@angular/forms';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCopyToClipboardDirective } from '@energinet-datahub/watt/clipboard';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';

import { EoTransfersStore } from './eo-transfers.store';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-transfers-wallet-modal',
  imports: [
    NgIf,
    WATT_MODAL,
    WattButtonComponent,
    WattCopyToClipboardDirective,
    WattEmptyStateComponent,
    WattTextFieldComponent,
    AsyncPipe,
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
      <form *ngIf="(walletDepositEndpointError$ | async) === undefined; else error">
        <p>
          To receive granular certificates the sender must create a transfer agreement. They need
          this key to identify the recipient (you).
        </p>
        <p style="margin-top: var(--watt-space-s);">
          <strong>The key is one-time use only</strong>
        </p>
        <div style="display: flex; align-items: center; margin: var(--watt-space-xl) 0;">
          <watt-text-field
            label="KEY"
            [formControl]="walletDepositEndpoint"
            [value]="(walletDepositEndpoint$ | async) || ''"
            #key
          />
          <watt-button
            variant="text"
            icon="contentCopy"
            [wattCopyToClipboard]="key.value"
            >Copy key</watt-button
          >
        </div>
      </form>
      <watt-modal-actions>
        <watt-button
          variant="secondary"
          data-testid="close-new-agreement-button"
          (click)="modal.close(true)"
        >
          Close
        </watt-button>
      </watt-modal-actions>
    </watt-modal>

    <ng-template #error>
      <watt-empty-state
        icon="power"
        title="An unexpected error occured"
        message="We are sorry, we could not generate your key. Please try again later."
        style="margin: var(--watt-space-xl) 0;"
      >
      </watt-empty-state>
    </ng-template>
  `,
})
export class EoTransfersWalletModalComponent {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  private cd = inject(ChangeDetectorRef);
  private store = inject(EoTransfersStore);

  protected opened = false;
  protected walletDepositEndpoint = new FormControl('');
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
      this.cd.detectChanges();
    });
  }

  onClosed() {
    this.opened = false;
  }

  createWalletDepositEndpoint() {
    this.store.createWalletDepositEndpoint();
  }
}
