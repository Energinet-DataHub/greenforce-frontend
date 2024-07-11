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
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

import { EoConsentClient, EoConsentService } from '@energinet-datahub/eo/consent/data-access-api';
import { translations } from '@energinet-datahub/eo/translations';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-grant-consent-modal',
  imports: [
    ReactiveFormsModule,
    NgClass,
    WATT_MODAL,
    WattIconComponent,
    WattCheckboxComponent,
    WattSpinnerComponent,
    TranslocoPipe,
    WattButtonComponent,
  ],
  standalone: true,
  styles: `
    .eo-grant-consent-modal .watt-modal {
      --watt-modal-width: 545px;
      --watt-modal-min-height: 648px !important;

      .watt-modal-content {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      watt-modal-actions {
        justify-content: space-between;
        align-items: center;

        watt-button {
          margin-left: var(--watt-space-m);
        }
      }

      h3 {
        text-align: center;
      }

      ul {
        display: flex;
        flex-direction: column;
        gap: var(--watt-space-m);
        margin-bottom: var(--watt-space-l);

        li {
          padding-left: 0;
          &::before {
            display: none;
          }

          p {
            padding-left: 22px; // magic number to align with checkbox
          }
        }
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
      <watt-modal
        #modal
        [hideCloseButton]="true"
        [disableClose]="true"
        [panelClass]="['eo-grant-consent-modal']"
        [formGroup]="form"
      >
        @if (!isLoading()) {
          <watt-icon style="color: #00847C" name="custom-assignment-add" size="xxl" class="icon" />
          <h3>
            {{
              translations.grantConsent.title | transloco: { organizationName: organizationName() }
            }}
          </h3>
          <p>
            {{
              translations.grantConsent.description
                | transloco: { organizationName: organizationName() }
            }}
          </p>

          <ul>
            @for (permission of permissions; track permission) {
              <li>
                <watt-checkbox [formControlName]="permission[0]">{{
                  permission[1].title | transloco
                }}</watt-checkbox>
                <p class="watt-text-s">{{ permission[1].description | transloco }}</p>
              </li>
            }
          </ul>
        } @else {
          <div class="loading-container">
            <watt-spinner />
          </div>
        }

        <watt-modal-actions
          [ngClass]="{ 'visually-hidden': isLoading() }"
          [attr.aria.hidden]="isLoading()"
        >
          <watt-checkbox formControlName="termsAndConditions"
            ><span
              [innerHTML]="translations.grantConsent.acceptTermsAndConditions | transloco"
            ></span
          ></watt-checkbox>
          <div>
            <watt-button variant="secondary" (click)="decline()">{{
              translations.grantConsent.decline | transloco
            }}</watt-button>
            <watt-button
              variant="secondary"
              (click)="accept()"
              [disabled]="!form.value.termsAndConditions"
              >{{ translations.grantConsent.accept | transloco }}</watt-button
            >
          </div>
        </watt-modal-actions>
      </watt-modal>
    }
  `,
})
export class EoGrantConsentModalComponent implements OnInit {
  private cd = inject(ChangeDetectorRef);
  private consentService: EoConsentService = inject(EoConsentService);
  private toastService: WattToastService = inject(WattToastService);
  private transloco = inject(TranslocoService);

  @Input() thirdPartyClientId!: string;
  @Input() redirectUrl!: string;

  @Output() closed = new EventEmitter<void>();
  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  protected translations = translations;
  protected permissions = Object.entries(translations.grantConsent.permissions);
  protected form!: FormGroup;
  protected isLoading = signal<boolean>(false);
  protected organizationName = signal<string>('');
  protected allowedRedirectUrl = signal<string>('');
  public opened = false;

  ngOnInit(): void {
    this.setForm();
  }

  private setForm() {
    this.form = new FormGroup({
      termsAndConditions: new FormControl(false),
    });

    this.permissions.forEach((permission) => {
      const name = permission[0];
      this.form.addControl(name, new FormControl({ value: true, disabled: true }));
    });
  }

  open() {
    // If the third party client id is not set, theres no reason to open the modal
    if (!this.thirdPartyClientId) return;

    // This is a workaround for "lazy loading" the modal content
    this.opened = true;
    this.cd.detectChanges();
    this.modal.open();

    this.isLoading.set(true);
    this.consentService.getClient(this.thirdPartyClientId).subscribe((client: EoConsentClient) => {
      this.organizationName.set(client.name);
      this.allowedRedirectUrl.set(client.redirectUrl);
      this.isLoading.set(false);
    });
  }

  accept() {
    if (!this.form.value.termsAndConditions) return;
    this.consentService.grant(this.thirdPartyClientId).subscribe({
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
