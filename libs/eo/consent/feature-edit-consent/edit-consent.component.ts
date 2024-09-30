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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { NgClass } from '@angular/common';
import { first } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

import { EoConsentService, EoConsent } from '@energinet-datahub/eo/consent/data-access-api';
import { translations } from '@energinet-datahub/eo/translations';
import { EoConsentPermissionsComponent } from '@energinet-datahub/eo/consent/feature-permissions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-edit-consent-modal',
  imports: [
    ReactiveFormsModule,
    NgClass,
    WATT_MODAL,
    WattIconComponent,
    WattCheckboxComponent,
    WattSpinnerComponent,
    TranslocoPipe,
    WattButtonComponent,
    EoConsentPermissionsComponent,
  ],
  standalone: true,
  styles: `
    .eo-edit-consent-modal .watt-modal {
      --watt-modal-width: 545px;

      h4 {
        margin-top: var(--watt-space-m);
      }

      watt-button {
        flex-shrink: 0;
      }

      .actions {
        display: flex;
        gap: var(--watt-space-s);
      }

      watt-modal-actions {
        justify-content: space-between;
        align-items: center;
        gap: 0;
        padding-left: 0;

        watt-button {
          margin-left: var(--watt-space-m);
        }
      }

      .description {
        display: flex;
        flex-direction: column;
        gap: var(--watt-space-m);
      }

      .loading-container {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .visually-hidden {
        opacity: 0;
      }
    }
  `,
  template: `
    @if (opened) {
      <watt-modal #modal [panelClass]="['eo-edit-consent-modal']" [title]="consent.clientName">
        @if (!isLoading()) {
          <div
            class="description"
            [innerHTML]="
              translations.editConsent.description
                | transloco: { organizationName: consent.clientName }
            "
          ></div>

          <eo-consent-permissions [serviceProviderName]="consent.clientName" />

          <div
            class="description"
            [innerHTML]="
              translations.editConsent.postDescription
                | transloco: { organizationName: consent.clientName }
            "
          ></div>
        } @else {
          <div class="loading-container">
            <watt-spinner />
          </div>
        }

        <watt-modal-actions
          [ngClass]="{ 'visually-hidden': isLoading() }"
          [attr.aria.hidden]="isLoading()"
        >
          <watt-button variant="secondary" (click)="deleteConsent()">{{
            translations.editConsent.revoke | transloco
          }}</watt-button>

          <div class="actions">
            <watt-button variant="primary" (click)="close(false)">{{
              translations.editConsent.cancel | transloco
            }}</watt-button>
          </div>
        </watt-modal-actions>
      </watt-modal>
    }
  `,
})
export class EoEditConsentModalComponent {
  private cd = inject(ChangeDetectorRef);
  private consentService: EoConsentService = inject(EoConsentService);
  private toastService: WattToastService = inject(WattToastService);
  private transloco = inject(TranslocoService);

  @Input() consent!: EoConsent;
  @Input() redirectUrl!: string;

  @Output() closed = new EventEmitter<void>();
  @Output() consentDeleted = new EventEmitter<EoConsent>();
  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  protected translations = translations;
  protected isLoading = signal<boolean>(false);
  protected organizationName = signal<string>('');
  protected allowedRedirectUrl = signal<string>('');
  public opened = false;

  open() {
    // If no consent is provided, there's no need to open the modal
    if (!this.consent) return;

    // This is a workaround for "lazy loading" the modal content
    this.opened = true;
    this.cd.detectChanges();
    this.modal.open();
  }

  save() {
    // Save changes
  }

  deleteConsent() {
    this.close(true);

    this.consentService.delete(this.consent.idpClientId).subscribe({
      next: () => {
        this.toastService.open({
          message: this.transloco.translate(this.translations.editConsent.revokeSuccess),
          type: 'success',
        });
      },
      error: () => {
        this.toastService.open({
          message: this.transloco.translate(this.translations.editConsent.revokeError),
          type: 'danger',
        });
      },
    });

    this.modal.closed.pipe(first()).subscribe(() => {
      this.consentDeleted.emit(this.consent);
    });
  }

  close(result: boolean) {
    this.modal.close(result);

    // We wait for setting opened, to the modal is actually closed to avoid any flickerness
    this.modal.closed.pipe(first()).subscribe(() => {
      this.opened = false;
      this.closed.emit();
    });
  }
}
