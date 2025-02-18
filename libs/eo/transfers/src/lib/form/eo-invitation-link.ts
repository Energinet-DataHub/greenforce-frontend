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
  Component,
  effect,
  ElementRef,
  input,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslocoPipe } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCopyToClipboardDirective } from '@energinet-datahub/watt/clipboard';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';

import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';
import { translations } from '@energinet-datahub/eo/translations';

function generateLink(id: string | null): string | null {
  const lang = window.location.pathname.split('/')[1];
  return id
    ? `${window.location.origin}/${lang}/${eoRoutes.transfer}?respond-proposal=${id}`
    : null;
}

@Component({
  selector: 'eo-transfers-invitation-link',
  imports: [
    VaterStackComponent,
    WattTextFieldComponent,
    WattButtonComponent,
    WattCopyToClipboardDirective,
    WattFieldHintComponent,
    WattFieldErrorComponent,
    TranslocoPipe,
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
        [value]="link() ?? ''"
        #key
      >
        @if (!hasError() && isNewlyCreated()) {
          <watt-field-hint>{{
            translations.createTransferAgreementProposal.summary.invitation.link.hint | transloco
          }}</watt-field-hint>
        }

        @if (!isNewlyCreated()) {
          <watt-field-hint>{{
            translations.createTransferAgreementProposal.summary.invitation.link.hintProposal
              | transloco
          }}</watt-field-hint>
        }

        <watt-field-error>{{
          translations.createTransferAgreementProposal.summary.invitation.link.error | transloco
        }}</watt-field-error>
      </watt-text-field>

      @if (!hasError()) {
        <watt-button
          #copyButton
          variant="text"
          icon="contentCopy"
          data-testid="copy-invitation-link-button"
          [wattCopyToClipboard]="key.value"
          >{{
            translations.createTransferAgreementProposal.summary.invitation.link.copy | transloco
          }}</watt-button
        >
      } @else {
        <watt-button
          (click)="retry.emit()"
          variant="text"
          icon="refresh"
          data-testid="generate-invitation-link-button"
          >{{
            translations.createTransferAgreementProposal.summary.invitation.link.retry | transloco
          }}</watt-button
        >
      }
    </vater-stack>
  `,
})
export class EoTransferInvitationLinkComponent implements OnInit {
  proposalId = input<string | null>();
  hasError = input<boolean>(false);
  isNewlyCreated = input<boolean>(true);
  retry = output<void>();
  link = signal<string | null>(null);

  @ViewChild('copyButton', { read: ElementRef }) copyButton!: ElementRef<HTMLButtonElement>;

  protected translations = translations;
  protected control: FormControl<string | null> = new FormControl(null);

  constructor() {
    effect(() => {
      const linkValue = this.link();
      this.control.setValue(linkValue);
    });

    effect(() => {
      const hasErrorValue = this.hasError();
      this.control.setErrors(hasErrorValue ? { hasError: true } : null);
      this.control.markAsTouched();
    });

    effect(() => {
      const proposalId = this.proposalId() ? this.proposalId() : null;
      this.link.set(generateLink(proposalId as string | null));
    });
  }

  ngOnInit(): void {
    this.control.disable();
  }

  copy(): void {
    this.copyButton.nativeElement.click();
  }
}
