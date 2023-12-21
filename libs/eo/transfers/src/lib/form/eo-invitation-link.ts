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
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCopyToClipboardDirective } from '@energinet-datahub/watt/clipboard';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { FormControl } from '@angular/forms';
import { NgIf } from '@angular/common';

function generateLink(id: string | null): string | null {
  return id ? `${window.location.origin}/${eoRoutes.transfer}?respond-proposal=${id}` : null;
}

@Component({
  standalone: true,
  selector: 'eo-transfers-invitation-link',
  imports: [
    VaterStackComponent,
    WattTextFieldComponent,
    WattButtonComponent,
    WattCopyToClipboardDirective,
    WattFieldHintComponent,
    WattFieldErrorComponent,
    NgIf,
  ],
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        display: block;
        background-color: var(--watt-color-primary-ultralight);
        padding: 20px; // TODO: MISSING SIZE
        width: 100%;

        watt-button {
          margin-top: var(--watt-space-s);
          min-width: 125px;
        }
      }
    `,
  ],
  template: `
    <vater-stack direction="row" align-items="center">
      <watt-text-field
        name="invitation-link"
        label="Invitation link"
        [formControl]="control"
        [value]="link ?? ''"
        #key
      >
        <watt-field-hint *ngIf="!hasError"
          >Link expires in 14 days, usable by one organization or specific company.</watt-field-hint
        >

        <watt-field-error>Couldn't generate link. Please try again.</watt-field-error>
      </watt-text-field>
      <watt-button
        #copyButton
        variant="text"
        icon="contentCopy"
        data-testid="copy-invitation-link-button"
        [wattCopyToClipboard]="key.value"
        *ngIf="!hasError"
        >Copy link</watt-button
      >

      <watt-button
        (click)="retry.emit()"
        variant="text"
        icon="refresh"
        data-testid="generate-invitation-link-button"
        *ngIf="hasError"
        >Generate</watt-button
      >
    </vater-stack>
  `,
})
export class EoTransferInvitationLinkComponent implements OnChanges {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({ alias: 'proposalId', transform: generateLink }) link!: string | null;
  @Input() hasError = false;

  @Output() retry = new EventEmitter<void>();

  @ViewChild('copyButton', { read: ElementRef }) copyButton!: ElementRef<HTMLButtonElement>;

  protected control: FormControl<string | null> = new FormControl(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['link']) {
      this.control.setValue(changes['link'].currentValue);
    }

    if (changes['hasError']) {
      this.control.setErrors(changes['hasError'].currentValue ? { hasError: true } : null);
      this.control.markAsTouched();
    }
  }

  copy(): void {
    this.copyButton.nativeElement.click();
  }
}
