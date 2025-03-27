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
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import {
  WattDrawerComponent,
  WattDrawerTopbarComponent,
  WattDrawerContentComponent,
} from '@energinet-datahub/watt/drawer';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatePipe } from '@energinet-datahub/watt/date';

import { translations } from '@energinet-datahub/eo/translations';
import { EoConsent } from '@energinet-datahub/eo/consent/data-access-api';

import { EoEditConsentModalComponent } from '@energinet-datahub/eo/consent/feature-edit-consent';
import { EoConsentPermissionsComponent } from '@energinet-datahub/eo/consent/feature-permissions';

const selector = 'eo-consent-details-drawer';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  imports: [
    WattDrawerComponent,
    WattDrawerTopbarComponent,
    WattDrawerContentComponent,
    WattButtonComponent,
    TranslocoPipe,
    WattDatePipe,
    EoEditConsentModalComponent,
    EoConsentPermissionsComponent,
  ],
  styles: `
    ${selector} {
      watt-drawer-content {
        padding: var(--watt-space-ml);
      }

      .valid-from {
        margin-top: var(--watt-space-m);
        strong {
          margin-right: var(--watt-space-xs);
          text-transform: uppercase !important;
        }
      }

      header {
        flex-direction: column;
        align-items: flex-end;

        watt-drawer-topbar {
          width: 100%;
          align-self: flex-start;
          justify-content: space-between;
          padding-right: var(--watt-space-l);
          order: 1;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }

        .cta {
          flex-shrink: 0;
        }

        .close-btn {
          align-self: auto !important;
        }
      }
    }
  `,
  template: `
    @if (opened) {
      <watt-drawer #modal size="small" class="hest">
        <watt-drawer-topbar>
          @if (consent) {
            <div>
              <h2>{{ consent.receiverOrganizationName }}</h2>
              <p class="valid-from">
                <strong>{{ translations.consentDetails.validFrom | transloco }}</strong>
                {{ consent.consentDate * 1000 | wattDate: 'short' }}
              </p>
            </div>

            <watt-button variant="secondary" class="cta" (click)="editConsent()">{{
              translations.consentDetails.editConsent | transloco
            }}</watt-button>
          }
        </watt-drawer-topbar>

        <watt-drawer-content>
          <h3>{{ translations.consentDetails.permissionsFor | transloco }}</h3>

          <eo-consent-permissions [serviceProviderName]="consent.receiverOrganizationName" />
        </watt-drawer-content>
      </watt-drawer>

      @if (consent) {
        <eo-edit-consent-modal [consent]="consent" (consentDeleted)="consentDeleted.emit($event)" />
      }
    }
  `,
})
export class EoConsentDetailsDrawerComponent {
  private cd = inject(ChangeDetectorRef);
  private transloco = inject(TranslocoService);

  @Input() consent!: EoConsent;
  @Output() closed = new EventEmitter<void>();
  @Output() consentDeleted = new EventEmitter<EoConsent>();

  @ViewChild(EoEditConsentModalComponent)
  editConsentModal!: EoEditConsentModalComponent;

  @ViewChild(WattDrawerComponent) drawer!: WattDrawerComponent;

  protected translations = translations;
  public opened = false;

  editConsent() {
    this.editConsentModal.open();
  }

  open() {
    // This is a workaround for "lazy loading" the modal content
    this.opened = true;
    this.cd.detectChanges();
    this.drawer.open();
  }

  close() {
    this.drawer.close();

    // We wait for setting opened, to the modal is actually closed to avoid any flickerness
    this.drawer.closed.subscribe(() => {
      this.opened = false;
      this.closed.emit();
    });
  }
}
