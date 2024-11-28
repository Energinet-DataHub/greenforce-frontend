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
  computed,
  ElementRef,
  EventEmitter,
  inject,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { first } from 'rxjs';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattCopyToClipboardDirective } from '@energinet-datahub/watt/clipboard';

import { translations } from '@energinet-datahub/eo/translations';
import { EoHtmlDocComponent } from '@energinet-datahub/eo/shared/components/ui-html-doc';

import { EoConsentPermissionsComponent } from '@energinet-datahub/eo/consent/feature-permissions';
import {
  EoActorService,
  ServiceProviderTermsService,
} from '@energinet-datahub/eo/auth/data-access';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { NgClass } from '@angular/common';
import { WattToastService } from '@energinet-datahub/watt/toast';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-request-consent-modal',
  imports: [
    WATT_MODAL,
    TranslocoPipe,
    WattButtonComponent,
    EoConsentPermissionsComponent,
    VaterStackComponent,
    WattTextFieldComponent,
    WattCopyToClipboardDirective,
    WattCheckboxComponent,
    EoHtmlDocComponent,
    ReactiveFormsModule,
    NgClass,
  ],
  standalone: true,
  styles: `
    .eo-request-consent-modal {
      .description {
        margin-top: var(--watt-space-m);
      }

      ol {
        margin: var(--watt-space-m);
      }

      .invitation-link {
        margin-top: var(--watt-space-m);
        background-color: var(--watt-color-primary-ultralight);
        padding: var(--watt-space-m);

        watt-button {
          margin-top: var(--watt-space-s);
          min-width: 125px;
        }
      }
    }

    .service-provider-modal-margin {
      div {
        margin-top: var(--watt-space-m);
        margin-bottom: var(--watt-space-l);
      }
    }

    .service-provider-modal-actions {
      display: flex;
      flex: 1;
      justify-content: space-between;
      align-items: center;
    }

    .accept-button-margin {
      margin-left: var(--watt-space-m);
    }
  `,
  template: `
    @if (opened) {
      <watt-modal
        #modal
        [title]="modalTitle() | transloco"
        [panelClass]="['eo-request-consent-modal']"
      >
        <!-- Request Consent Modal -->
        @if (serviceProviderTermsService.serviceProviderTermsAccepted()) {
          <div
            [innerHTML]="translations.requestConsent.description | transloco"
            class="description"
          ></div>

          <vater-stack direction="row" align-items="center" class="invitation-link">
            <watt-text-field
              name="invitation-link"
              label="Invitation link"
              [formControl]="control"
              #key
            />

            <watt-button
              #copyButton
              variant="text"
              icon="contentCopy"
              data-testid="copy-invitation-link-button"
              [wattCopyToClipboard]="control.value ?? ''"
              >{{ translations.requestConsent.copy | transloco }}
            </watt-button>
          </vater-stack>
        } @else {
          <!-- Service Provider Terms -->
          <eo-html-doc class="service-provider-modal-margin" [path]="serviceProviderTermsPath" />
        }

        <watt-modal-actions>
          <!-- Request Consent Modal Actions -->
          @if (serviceProviderTermsService.serviceProviderTermsAccepted()) {
            <watt-button variant="primary" (click)="copyLinkAndCloseModal(true)"
              >{{ translations.requestConsent.copyAndClose | transloco }}
            </watt-button>
          } @else {
            <!-- Request Consent Modal Actions -->
            <div class="service-provider-modal-actions">
              <watt-checkbox [formControl]="acceptedServiceProviderTermsFormControl"
                >{{ translations.serviceProviderTermsConsent.acceptTerms | transloco }}
              </watt-checkbox>
              <div>
                <watt-button variant="secondary" (click)="modal.close(false)"
                  >{{ translations.serviceProviderTermsConsent.decline | transloco }}
                </watt-button>
                <watt-button
                  variant="primary"
                  class="accept-button-margin"
                  (click)="acceptServiceProviderTerms()"
                  >{{ translations.serviceProviderTermsConsent.accept | transloco }}
                </watt-button>
              </div>
            </div>
          }
        </watt-modal-actions>
      </watt-modal>
    }
  `,
})
export class EoRequestConsentModalComponent {
  private cd = inject(ChangeDetectorRef);
  private actorService: EoActorService = inject(EoActorService);
  private link = `${window.location.origin}/consent?organization-id=${this.actorService.self.org_id}`;
  protected serviceProviderTermsService = inject(ServiceProviderTermsService);
  private toastService = inject(WattToastService);
  @Output() closed = new EventEmitter<void>();
  @ViewChild(WattModalComponent) modal!: WattModalComponent;
  @ViewChild('copyButton', { read: ElementRef }) copyButton!: ElementRef<HTMLButtonElement>;

  protected serviceProviderTermsPath = 'assets/service-provider-terms/${lang}.html';
  protected transloco = inject(TranslocoService);
  protected control: FormControl<string | null> = new FormControl({
    value: this.link,
    disabled: true,
  });
  protected translations = translations;
  protected acceptedServiceProviderTermsFormControl = new FormControl(false, [
    Validators.required,
    Validators.requiredTrue,
  ]);
  modalTitle = computed(() =>
    this.serviceProviderTermsService.serviceProviderTermsAccepted()
      ? translations.requestConsent.title
      : translations.serviceProviderTermsConsent.title
  );
  public opened = false;

  open() {
    // This is a workaround for "lazy loading" the modal content
    this.opened = true;
    this.cd.detectChanges();

    this.acceptedServiceProviderTermsFormControl.reset(false);
    this.modal.open();
  }

  copyLinkAndCloseModal(result: boolean) {
    this.copyButton.nativeElement.click();
    this.modal.close(result);

    // We wait for setting opened, to the modal is actually closed to avoid any flickerness
    this.modal.closed.pipe(first()).subscribe(() => {
      this.opened = false;
      this.closed.emit();
    });
  }

  acceptServiceProviderTerms() {
    this.acceptedServiceProviderTermsFormControl.markAsDirty();
    if (this.acceptedServiceProviderTermsFormControl.valid) {
      this.serviceProviderTermsService
        .acceptServiceProviderTerms()
        .pipe(first())
        .subscribe({
          next: () => {
            this.serviceProviderTermsService.serviceProviderTermsAccepted.set(true);
          },
          error: () => {
            this.serviceProviderTermsService.serviceProviderTermsAccepted.set(false);
            this.toastService.open({
              message: this.transloco.translate(this.translations.shared.error.message),
              type: 'danger',
            });
          },
        });
    }
  }
}
