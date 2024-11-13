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
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { first } from 'rxjs';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattCopyToClipboardDirective } from '@energinet-datahub/watt/clipboard';

import { translations } from '@energinet-datahub/eo/translations';

import { EoConsentPermissionsComponent } from '@energinet-datahub/eo/consent/feature-permissions';
import { EoActorService } from '@energinet-datahub/eo/auth/data-access';

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
  `,
  template: `
    @if (opened) {
      <watt-modal
        #modal
        [title]="translations.requestConsent.title | transloco"
        [panelClass]="['eo-request-consent-modal']"
      >
        <div [innerHTML]="translations.requestConsent.description | transloco" class="description"></div>

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
            >{{ translations.requestConsent.copy | transloco }}</watt-button
          >
        </vater-stack>

        <watt-modal-actions>
          <watt-button variant="primary" (click)="close(true)">{{
            translations.requestConsent.copyAndClose | transloco
          }}</watt-button>
        </watt-modal-actions>
      </watt-modal>
    }
  `,
})
export class EoRequestConsentModalComponent {
  private cd = inject(ChangeDetectorRef);
  private actorService: EoActorService = inject(EoActorService);
  private link = `${window.location.origin}/consent?organization-id=${this.actorService.self.org_id}`;

  @Output() closed = new EventEmitter<void>();
  @ViewChild(WattModalComponent) modal!: WattModalComponent;
  @ViewChild('copyButton', { read: ElementRef }) copyButton!: ElementRef<HTMLButtonElement>;

  protected transloco = inject(TranslocoService);
  protected control: FormControl<string | null> = new FormControl({
    value: this.link,
    disabled: true,
  });
  protected translations = translations;

  public opened = false;

  open() {
    // This is a workaround for "lazy loading" the modal content
    this.opened = true;
    this.cd.detectChanges();
    this.modal.open();
  }

  close(result: boolean) {
    this.copyButton.nativeElement.click();
    this.modal.close(result);

    // We wait for setting opened, to the modal is actually closed to avoid any flickerness
    this.modal.closed.pipe(first()).subscribe(() => {
      this.opened = false;
      this.closed.emit();
    });
  }
}
