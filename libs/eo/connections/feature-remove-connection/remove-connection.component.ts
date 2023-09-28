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
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { first } from 'rxjs';

import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCopyToClipboardDirective } from '@energinet-datahub/watt/clipboard';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattInputDirective } from '@energinet-datahub/watt/input';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { EoConnectionWithName, EoConnectionsService } from '../data-access-api/connections.service';

@Component({
  selector: 'eo-remove-connection',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgIf,
    WATT_FORM_FIELD,
    WATT_MODAL,
    WattButtonComponent,
    WattCopyToClipboardDirective,
    WattInputDirective,
    WattEmptyStateComponent,
    VaterStackComponent,
  ],
  template: `
    <watt-button
      variant="icon"
      icon="remove"
      [loading]="isRemovingConnection()"
      (click)="onRemoveConnection()"
      data-testid="remove-connection-button"
    ></watt-button>

    <!-- Confirmation dialog -->
    <watt-modal
      title="Remove connection?"
      size="small"
      closeLabel="Close modal"
      (closed)="onConfirmationClosed($event)"
      *ngIf="isOpen()"
    >
      <p>Removing the connection will not affect ongoing or planned transfer agreements.</p>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="confirmationModal.close(false)"
          >Cancel</watt-button
        >
        <watt-button
          variant="secondary"
          (click)="confirmationModal.close(true)"
          data-testid="confirm-removal-button"
          >Remove connection</watt-button
        >
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class EoRemoveConnectionComponent {
  @Input({ required: true }) connection!: EoConnectionWithName;
  @Output() connectionRemoved = new EventEmitter<EoConnectionWithName>();
  @ViewChild(WattModalComponent) confirmationModal!: WattModalComponent;

  private cd = inject(ChangeDetectorRef);
  private connectionsService = inject(EoConnectionsService);
  private toastService = inject(WattToastService);

  protected isRemovingConnection = signal<boolean>(false);
  protected isOpen = signal<boolean>(false);

  onRemoveConnection() {
    this.isOpen.set(true);
    this.cd.detectChanges();
    this.confirmationModal.open();
  }

  onConfirmationClosed(shouldRemoveConnection: boolean) {
    if (shouldRemoveConnection) {
      this.isRemovingConnection.set(true);
      this.connectionsService
        .deleteConnection(this.connection.id)
        .pipe(first())
        .subscribe({
          next: () => {
            this.isRemovingConnection.set(false);
            this.connectionRemoved.emit(this.connection);
          },
          error: () => {
            this.toastService.open({
              message: 'Issue encountered. Please try again or reload the page.',
              type: 'danger',
            });
            this.isRemovingConnection.set(false);
          },
        });
    }
    this.isOpen.set(false);
  }
}
