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
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { EoConsentClient, EoConsentService } from '@energinet-datahub/eo/consent/data-access-api';
import { translations } from '@energinet-datahub/eo/translations';
import { EoGenitivePipe } from '@energinet-datahub/eo/shared/utilities';
import { EoConsentPermissionsComponent } from '@energinet-datahub/eo/consent/feature-permissions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-grant-consent-modal',
  imports: [
    WATT_MODAL,
    WattIconComponent,
    WattEmptyStateComponent,
    TranslocoPipe,
    WattButtonComponent,
    EoGenitivePipe,
    EoConsentPermissionsComponent,
  ],
  styles: `
    .eo-grant-consent-modal .watt-modal {
      --watt-modal-width: 545px;

      .watt-modal__spinner {
        background: var(--watt-color-neutral-white);
        z-index: 1;
      }

      p {
        margin-top: var(--watt-space-s);
      }

      h3 {
        text-align: center;
        margin-bottom: var(--watt-space-m);
      }

      h4 {
        margin-top: var(--watt-space-m);
      }

      watt-empty-state {
        margin-top: var(--watt-space-m);
      }

      watt-modal-actions {
        gap: var(--watt-space-m);
      }
    }
  `,
  template: `
    @if (opened) {
      <watt-modal
        #modal
        [hideCloseButton]="true"
        [disableClose]="true"
        [loading]="isLoading()"
        [panelClass]="['eo-grant-consent-modal']"
      >
        @if (!hasError()) {
          <watt-icon style="color: #00847C" name="custom-assignment-add" size="xxl" class="icon" />
          <h3>
            {{
              translations.grantConsent.title | transloco: { organizationName: organizationName() }
            }}
          </h3>
          <div
            class="description"
            [innerHTML]="
              translations.grantConsent.description
                | transloco
                  : {
                      organizationName: organizationName(),
                    }
            "
          ></div>

          <eo-consent-permissions [serviceProviderName]="organizationName()" />

          <div
            class="description"
            [innerHTML]="
              translations.grantConsent.postDescription
                | transloco
                  : {
                      organizationName: organizationName(),
                      genitiveOrganizationName:
                        organizationName() | genitive: transloco.getActiveLang(),
                    }
            "
          ></div>
        } @else {
          <watt-empty-state
            icon="custom-power"
            [title]="translations.grantConsent.error.title | transloco"
            [message]="translations.grantConsent.error.message | transloco"
          />
        }

        <watt-modal-actions>
          @if (!isLoading() && !hasError()) {
            <watt-button variant="secondary" (click)="decline()">{{
              translations.grantConsent.decline | transloco
            }}</watt-button>
            <watt-button variant="secondary" (click)="accept()">{{
              translations.grantConsent.accept | transloco
            }}</watt-button>
          } @else {
            <watt-button variant="secondary" (click)="close(false)">{{
              translations.grantConsent.close | transloco
            }}</watt-button>
          }
        </watt-modal-actions>
      </watt-modal>
    }
  `,
})
export class EoGrantConsentModalComponent {
  private cd = inject(ChangeDetectorRef);
  private consentService: EoConsentService = inject(EoConsentService);
  private toastService: WattToastService = inject(WattToastService);
  protected transloco = inject(TranslocoService);

  @Input() thirdPartyClientId?: string;
  @Input() organizationId?: string;
  @Input() redirectUrl?: string;

  @Output() closed = new EventEmitter<void>();
  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  protected translations = translations;
  protected isLoading = signal<boolean>(false);
  protected hasError = signal<boolean>(false);
  protected organizationName = signal<string>('');
  protected allowedRedirectUrl = signal<string>('');
  public opened = false;

  open() {
    // If the third party client id or organization id is not set, theres no reason to open the modal
    if (!this.thirdPartyClientId && !this.organizationId) return;

    // This is a workaround for "lazy loading" the modal content
    this.opened = true;
    this.cd.detectChanges();
    this.modal.open();

    this.isLoading.set(true);

    if (this.thirdPartyClientId) {
      this.consentService.getClient(this.thirdPartyClientId).subscribe({
        next: (client: EoConsentClient) => {
          this.organizationName.set(client.name);
          this.allowedRedirectUrl.set(client.redirectUrl);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.hasError.set(true);
        },
      });
    }

    if (this.organizationId) {
      this.consentService.getOrganization(this.organizationId).subscribe({
        next: (organization) => {
          this.organizationName.set(organization.organizationName);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.hasError.set(true);
        },
      });
    }
  }

  accept() {
    let grantConsentRequest;

    if (this.thirdPartyClientId) {
      grantConsentRequest = this.consentService.grantClient(this.thirdPartyClientId);
    } else {
      grantConsentRequest = this.consentService.grantOrganization(this.organizationId as string);
    }

    grantConsentRequest?.subscribe({
      next: () => {
        this.redirectOrClose(true);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 403) return;

        this.toastService.open({
          message: this.transloco.translate(this.translations.grantConsent.error.title),
          type: 'danger',
        });
      },
    });
  }

  decline() {
    this.toastService.open({
      message: this.transloco.translate(this.translations.grantConsent.declined),
    });

    this.redirectOrClose(false);
  }

  close(result: boolean) {
    this.modal.close(result);

    // We wait for setting opened, to the modal is actually closed to avoid any flickerness
    this.modal.closed.pipe(first()).subscribe(() => {
      this.opened = false;
      this.closed.emit();
    });
  }

  private redirectOrClose(result: boolean) {
    if (this.redirectUrl && this.isRedirectAllowed(this.redirectUrl, this.allowedRedirectUrl())) {
      window.location.assign(
        this.addQueryParams(this.redirectUrl, { state: result ? 'granted' : 'declined' })
      );
    } else {
      if (result) {
        this.toastService.open({
          message: this.transloco.translate(this.translations.grantConsent.accepted),
          type: 'success',
        });
      }

      this.close(result);
    }
  }

  private addQueryParams(url: string, params: Record<string, string>): string {
    const urlObj = new URL(url);
    const searchParams = new URLSearchParams(urlObj.search);

    // Add the new query parameters to the existing ones
    for (const key of Object.keys(params)) {
      searchParams.set(key, params[key]);
    }

    // Set the updated search parameters back to the URL object
    urlObj.search = searchParams.toString();

    return urlObj.toString();
  }

  private isRedirectAllowed(redirectURL: string, allowedRedirect: string) {
    try {
      // Parse both URLs
      const redirectUrlObj = new URL(redirectURL);
      const allowedRedirectUrlObj = new URL(allowedRedirect);

      // Compare hostnames
      return redirectUrlObj.hostname === allowedRedirectUrlObj.hostname;
    } catch (error) {
      return false;
    }
  }
}
