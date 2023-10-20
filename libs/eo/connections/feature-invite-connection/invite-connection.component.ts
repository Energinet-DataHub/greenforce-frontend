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
import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { FormGroupDirective } from '@angular/forms';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCopyToClipboardDirective } from '@energinet-datahub/watt/clipboard';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattTextFieldTDComponent } from '@energinet-datahub/watt/text-field';

import { EoInviteConnectionService } from '@energinet-datahub/eo/connections/data-access-api';

@Component({
  selector: 'eo-invite-connection',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  providers: [FormGroupDirective],
  imports: [
    NgIf,
    WATT_MODAL,
    WattButtonComponent,
    WattCopyToClipboardDirective,
    WattEmptyStateComponent,
    VaterStackComponent,
    WattTextFieldTDComponent,
  ],
  template: `
    <watt-modal
      #modal
      title="New invitation link"
      [loading]="inviteLink().loading"
      loadingMessage="Please wait while we generate your invitation link"
      closeLabel="Close modal"
      (closed)="onClosed()"
      *ngIf="isOpen()"
    >
      <form *ngIf="!inviteLink().hasError; else error">
        <p>To enter into a transfer agreement you must be connected with the other organisation.</p>
        <br />
        <p>Copy and send the invitation link to the organisation you would like to connect with.</p>
        <br />
        <p>
          <strong>The link can only be used by one organisation.</strong>
        </p>
        <br />
        <vater-stack direction="row">
          <watt-text-field
            label="Invitation link"
            data-testid="invitation-link"
            [value]="inviteLink().link ?? ''"
            #key
          />
          <watt-button
            variant="text"
            icon="contentCopy"
            data-testid="copy-invitation-link-button"
            [wattCopyToClipboard]="key.value"
            >Copy link</watt-button
          >
        </vater-stack>
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(true)"> Close </watt-button>
      </watt-modal-actions>
    </watt-modal>

    <ng-template #error>
      <watt-empty-state
        icon="power"
        title="An unexpected error occured"
        message="We are sorry, we could not generate your invitation link. Please try again later."
      >
      </watt-empty-state>
    </ng-template>
  `,
})
export class EoInviteConnectionComponent {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  private cd = inject(ChangeDetectorRef);
  private inviteConnectionService = inject(EoInviteConnectionService);
  private inviteLinkIntialState = {
    loading: false,
    hasError: false,
    link: null,
  };
  protected isOpen = signal<boolean>(false);
  protected inviteLink = signal<{ loading: boolean; hasError: boolean; link: string | null }>(
    this.inviteLinkIntialState
  );

  open() {
    this.isOpen.set(true);
    this.cd.detectChanges();
    this.modal.open();
    this.createInviteLink();
  }

  onClosed() {
    this.isOpen.set(false);
  }

  private createInviteLink() {
    this.inviteLink.set({ loading: true, hasError: false, link: null });
    this.inviteConnectionService.generateInviteLink().subscribe({
      next: (link) => {
        this.inviteLink.set({ loading: false, hasError: false, link });
      },
      error: () => {
        this.inviteLink.set({ loading: false, hasError: true, link: null });
      },
    });
  }
}
