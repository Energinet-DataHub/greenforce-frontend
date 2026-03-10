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
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import { WattDatePipe } from '@energinet/watt/date';
import { WattSpinnerComponent } from '@energinet/watt/spinner';
import { ConversationMessage } from '@energinet-datahub/dh/shared/domain/graphql';
import { TranslocoDirective } from '@jsverse/transloco';
import { WattSeparatorComponent } from '@energinet/watt/separator';

import { injectDownloadMessageDocument } from './download-message-document';

@Component({
  selector: 'dh-actor-conversation-message',
  imports: [
    VaterStackComponent,
    WattDatePipe,
    WattSpinnerComponent,
    TranslocoDirective,
    VaterUtilityDirective,
    WattSeparatorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .message-container {
      border-radius: var(--watt-radius-m);
      border: 1px solid var(--watt-color-neutral-grey-300);
    }

    .attachment-link {
      color: var(--watt-color-primary);
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      font: inherit;
      text-align: left;
    }

    .attachment-link:hover:not(:disabled) {
      text-decoration: underline;
    }

    .attachment-link:disabled {
      opacity: 0.6;
      cursor: default;
    }

    .italic {
      font-style: italic;
    }
  `,
  host: {
    class: 'watt-space-inset-m',
    '[style.align-self]': 'messageAlignment()',
    '[style.max-width]': '"66%"',
  },
  template: `
    <vater-stack
      class="message-container"
      [style.background-color]="backgroundColor()"
      *transloco="let t; prefix: 'meteringPoint.actorConversation'"
    >
      <vater-stack fill="horizontal" align="start" class="watt-space-inset-m">
        <vater-stack direction="row" justify="space-between" fill="horizontal" gap="m">
          <span>{{ t('receivers.' + message().senderType) }}</span>
          <span>{{ message().createdTime | wattDate: 'short' }}</span>
        </vater-stack>
        @if (message().actorName && message().userName) {
          <span>
            {{ message().actorName + ', ' + message().userName }}
            @if (message().actorName && message().userName && message().anonymous) {
              {{ t('sentAnonymously') }}
            }
          </span>
        }
      </vater-stack>
      <watt-separator />
      <vater-stack align="start" fill="horizontal" class="watt-space-inset-m">
        @switch (message().messageType) {
          @case ('USER_MESSAGE') {
            <span vater fill="horizontal">
              {{ message().userMessage?.content }}
            </span>
          }
          @case ('ELECTRICAL_HEATING_INFORMATION') {
            <span class="italic">{{
              t('electricalHeatingInformationStatus', {
                electricalHeatingStatus: message().electricalHeatingInformation
                  ?.isElectricalHeatingActive
                  ? t('yes')
                  : t('no'),
              })
            }}</span>
            <span class="italic">{{
              t('electricalHeatingInformationDate', {
                electricalHeatingDate:
                  message().electricalHeatingInformation?.electricalHeatingFrom | wattDate,
              })
            }}</span>
            <span class="italic">{{
              t('electricalHeatingInformationCustomer', {
                customerName: message().electricalHeatingInformation?.customerName,
              })
            }}</span>
            <span class="italic">{{
              t('electricalHeatingInformationSupplierPeriod', {
                energySupplierPeriodFrom:
                  message().electricalHeatingInformation?.supplierPeriods?.at(0)?.from | wattDate,
                energySupplierPeriodTo:
                  message().electricalHeatingInformation?.supplierPeriods?.at(0)?.to | wattDate,
              })
            }}</span>
          }
          @case ('ELECTRICAL_HEATING_USER_MESSAGE') {
            <span>{{
              t('electricalHeatingUserAddressEligibilityDate', {
                addressEligibilityDate:
                  message().electricalHeatingUserMessage?.electricalHeatingFrom | wattDate,
              })
            }}</span>
            <span class="watt-space-stack-ml">{{
              t('electricalHeatingUserChargeReductionPeriod', {
                chargeReductionPeriodFrom:
                  message().electricalHeatingUserMessage?.reductionPeriod?.from | wattDate,
                chargeReductionPeriodTo:
                  (message().electricalHeatingUserMessage?.reductionPeriod?.to | wattDate) ?? '',
              })
            }}</span>
            <span>{{ message().electricalHeatingUserMessage?.content }}</span>
          }
          @case ('CLOSING_MESSAGE') {
            <span vater fill="horizontal" class="italic">
              {{ t('closingMessage') }}
            </span>
          }
        }
      </vater-stack>
      @if (message().attachments.length) {
        <vater-stack fill="horizontal" align="start" class="watt-space-inset-m" gap="xs">
          @for (attachment of message().attachments; track attachment.documentId) {
            <vater-stack direction="row" align="center" gap="xs">
              <button
                type="button"
                class="attachment-link"
                [disabled]="documentDownload.downloading().has(attachment.documentId)"
                (click)="documentDownload.download(attachment.documentId, attachment.documentName)"
              >
                {{ attachment.documentName }}
              </button>
              @if (documentDownload.downloading().has(attachment.documentId)) {
                <watt-spinner [diameter]="16" [strokeWidth]="2" />
              }
            </vater-stack>
          }
        </vater-stack>
      }
    </vater-stack>
  `,
})
export class DhActorConversationMessageComponent {
  message = input.required<ConversationMessage>();
  messageAlignment = computed(() => (this.message().isSentByCurrentActor ? 'end' : 'start'));
  backgroundColor = computed(() =>
    this.message().isSentByCurrentActor
      ? 'var(--watt-color-primary-ultralight)'
      : 'var(--watt-color-neutral-grey-100)'
  );

  documentDownload = injectDownloadMessageDocument();
}
