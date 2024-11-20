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
  inject,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';
import { translations } from '@energinet-datahub/eo/translations';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { first } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-service-provider-terms-consent-modal',
  imports: [WATT_MODAL, TranslocoPipe, WattButtonComponent],
  standalone: true,
  styles: ``,
  template: `
    @if (opened) {
      <watt-modal
        #modal
        [title]="translations.serviceProviderTermsConsent.title | transloco"
        [size]="'large'"
        closeLabel="Close modal"
      >
        <h4 wattTooltip="Tooltip in modal">Insert real document</h4>
        <watt-modal-actions>
          <watt-button variant="secondary" (click)="modal.close(false)"
            >{{ translations.serviceProviderTermsConsent.decline | transloco }}
          </watt-button>
          <watt-button (click)="modal.close(true)"
            >{{ translations.serviceProviderTermsConsent.accept | transloco }}
          </watt-button>
        </watt-modal-actions>
      </watt-modal>
    }
  `,
})
export class EoServiceProviderTermsConsentModalComponent {
  private cd = inject(ChangeDetectorRef);

  @Output() closed = new EventEmitter<void>();
  @ViewChild(WattModalComponent) modal!: WattModalComponent;
  protected translations = translations;

  public opened = false;

  open() {
    // This is a workaround for "lazy loading" the modal content
    this.opened = true;
    this.cd.detectChanges();
    this.modal.open();
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
