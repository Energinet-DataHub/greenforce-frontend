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
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet } from '@angular/common';
import { Router } from '@angular/router';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCopyToClipboardDirective } from '@energinet-datahub/watt/clipboard';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattToastService } from '@energinet-datahub/watt/toast';

import {
  EoInviteConnectionService,
  InviteConnectionResponse,
  EoConnectionWithName,
  EoCvrService,
} from '@energinet-datahub/eo/connections/data-access-api';

@Component({
  selector: 'eo-invite-connection-repsond',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgIf,
    WATT_MODAL,
    WattButtonComponent,
    WattCopyToClipboardDirective,
    WattEmptyStateComponent,
    VaterStackComponent,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    NgTemplateOutlet,
  ],
  template: `
    <watt-modal
      #modal
      title=""
      [loading]="isLoading()"
      loadingMessage="Please wait while we load the invitation"
      closeLabel="Close modal"
      (closed)="onClosed()"
      *ngIf="isOpen()"
    >
      <ng-container [ngSwitch]="contentTemplate()">
        <ng-container *ngSwitchDefault [ngTemplateOutlet]="default" />
        <ng-container *ngSwitchCase="'ownConnection'" [ngTemplateOutlet]="ownConnection" />
        <ng-container *ngSwitchCase="'notFound'" [ngTemplateOutlet]="notFound" />
        <ng-container *ngSwitchCase="'alreadyConnected'" [ngTemplateOutlet]="alreadyConnected" />
        <ng-container *ngSwitchCase="'unknownError'" [ngTemplateOutlet]="unknownError" />
      </ng-container>
    </watt-modal>

    <ng-template #default>
      <div style="text-align: center;" [style.opacity]="isLoading() ? 0 : 1">
        <h3>
          {{
            connectionInvitation()?.companyName !== '—'
              ? connectionInvitation()?.companyName
              : connectionInvitation()?.senderCompanyTin
          }}
          wants to connect <br />with your organization
        </h3>
        <p>Connections can be used to enter into transfer agreements.</p>
      </div>

      <watt-modal-actions *ngIf="!isLoading()">
        <watt-button variant="secondary" (click)="onDecline()"> Decline </watt-button>
        <watt-button variant="primary" (click)="onAccept()"> Accept invitation </watt-button>
      </watt-modal-actions>
    </ng-template>

    <ng-template #ownConnection>
      <watt-empty-state
        icon="warning"
        title="Invalid invitation"
        message="You cannot Accept/Deny invitations from your own organization."
      />

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">Close</watt-button>
      </watt-modal-actions>
    </ng-template>

    <ng-template #notFound>
      <watt-empty-state
        icon="warning"
        title="Not found"
        message="The invitation has expired, declined, or is already accepted."
      />

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">Close</watt-button>
      </watt-modal-actions>
    </ng-template>

    <ng-template #alreadyConnected>
      <watt-empty-state
        icon="success"
        title="Already connected"
        message="You're already connected with {{ connectionInvitation()?.senderCompanyTin }}."
      />

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">Close</watt-button>
      </watt-modal-actions>
    </ng-template>

    <ng-template #unknownError>
      <watt-empty-state
        icon="power"
        title="An unexpected error occured"
        message="We are sorry, we could not load your invitation link. Please try again later."
      />
    </ng-template>
  `,
})
export class EoInviteConnectionRespondComponent implements OnChanges {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;
  @Input() connectionInvitationId!: string;
  @Output() closed = new EventEmitter<EoConnectionWithName | null>();
  @Output() connectionCreated = new EventEmitter<{ id: string; companyTin: string }>();

  private cd = inject(ChangeDetectorRef);
  private router = inject(Router);
  private toastService = inject(WattToastService);
  private inviteConnectionService = inject(EoInviteConnectionService);
  private cvrService = inject(EoCvrService);

  protected isOpen = signal<boolean>(false);
  protected isLoading = signal<boolean>(false);
  protected contentTemplate = signal<
    'notFound' | 'alreadyConnected' | 'ownConnection' | 'unknownError' | null
  >(null);
  protected connectionInvitation = signal<InviteConnectionResponse | null>(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['connectionInvitationId'] && changes['connectionInvitationId'].currentValue) {
      this.isLoading.set(true);
      this.inviteConnectionService.getInvitation(this.connectionInvitationId).subscribe({
        next: (invitation) => {
          this.isLoading.set(false);
          this.contentTemplate.set(null);

          this.cvrService.getCompanyName(invitation.senderCompanyTin).subscribe((companyName) => {
            this.connectionInvitation.set({
              ...invitation,
              companyName,
            });
          });
        },
        error: (error) => {
          this.isLoading.set(false);

          if (error.status === 400) {
            this.contentTemplate.set('ownConnection');
          } else if (error.status === 404) {
            this.contentTemplate.set('notFound');
          } else if (error.status === 409) {
            this.contentTemplate.set('alreadyConnected');
          } else {
            this.contentTemplate.set('unknownError');
          }
        },
      });
    }
  }

  open() {
    this.isOpen.set(true);
    this.cd.detectChanges();
    this.modal.open();
  }

  onClosed() {
    this.isOpen.set(false);
    this.router.navigate([], {
      queryParams: { respondInvite: undefined },
      replaceUrl: true,
    });
  }

  onAccept() {
    this.modal.close(true);
    const invitation = this.connectionInvitation();
    if (invitation) {
      this.closed.emit({
        id: invitation?.id,
        companyId: invitation?.senderCompanyId,
        companyTin: invitation?.senderCompanyTin,
        companyName: invitation?.companyName ?? '—',
      });
    }

    this.inviteConnectionService.acceptInvitation(this.connectionInvitationId).subscribe({
      next: (response) => {
        this.toastService.open({
          message: `You are now successfully connected with ${
            this.connectionInvitation()?.companyName !== '—'
              ? this.connectionInvitation()?.companyName
              : this.connectionInvitation()?.senderCompanyTin
          }.`,
          type: 'success',
        });

        if (invitation) {
          this.connectionCreated.emit({
            id: response.id,
            companyTin: invitation.senderCompanyTin,
          });
        }
      },
      error: () => {
        this.toastService.open({
          message: `Could not connect with ${
            this.connectionInvitation()?.companyName !== '—'
              ? this.connectionInvitation()?.companyName
              : this.connectionInvitation()?.senderCompanyTin
          }. Please try again or request the organization that sent the invitation to generate a new link.`,
          type: 'danger',
          duration: 24 * 60 * 60 * 1000, // 24 hours
        });
      },
    });
  }

  onDecline() {
    this.modal.close(false);
    this.closed.emit(null);
  }
}
