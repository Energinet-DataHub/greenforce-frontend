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
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import {
  VaterFlexComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet/watt/vater';
import {
  WattMenuComponent,
  WattMenuItemComponent,
  WattMenuTriggerDirective,
} from '@energinet/watt/menu';
import { MessageFormValue } from '../types';
import { DhActorConversationMessageFormComponent } from './actor-conversation-message-form.component';
import { lazyQuery, mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattModalService } from '@energinet/watt/modal';
import { WattBadgeComponent } from '@energinet/watt/badge';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattHeadingComponent } from '@energinet/watt/heading';
import { WattSeparatorComponent } from '@energinet/watt/separator';

import {
  CloseConversationDocument,
  GetConversationDocument,
  GetConversationsDocument,
  GetMeteringPointConversationInfoDocument,
  MarkConversationUnReadDocument,
  MarketRole,
  ParticipantType,
  SendActorConversationMessageDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { injectUploadMessageDocument } from './upload-message-document';
import { DhActorConversationMessageComponent } from './actor-conversation-message';
import { DhActorConversationInternalNoteModalComponent } from './actor-conversation-internal-note-modal.component';
import { WattSkeletonComponent } from '@energinet/watt/skeleton';
import { WATT_DESCRIPTION_LIST } from '@energinet/watt/description-list';

@Component({
  selector: 'dh-actor-conversation-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    TranslocoDirective,
    ReactiveFormsModule,
    WattMenuComponent,
    WattIconComponent,
    WattBadgeComponent,
    VaterStackComponent,
    WattButtonComponent,
    WattHeadingComponent,
    WattMenuItemComponent,
    WattSeparatorComponent,
    WattMenuTriggerDirective,
    VaterFlexComponent,
    VaterUtilityDirective,
    DhResultComponent,
    DhActorConversationMessageComponent,
    VaterFlexComponent,
    WattHeadingComponent,
    WattSeparatorComponent,
    WattSkeletonComponent,
    WATT_DESCRIPTION_LIST,
    DhActorConversationMessageFormComponent,
  ],
  styles: `
    .sticky-background {
      background-color: var(--bg-card);
    }

    .no-padding-bottom {
      padding-bottom: 0;
    }

    .wrap-gap {
      column-gap: var(--watt-space-m);
      row-gap: var(--watt-space-xs);
    }
  `,
  template: `
    <dh-result vater fill="vertical" [query]="conversationQuery">
      <vater-flex
        direction="column"
        fill="both"
        *transloco="let t; prefix: 'meteringPoint.actorConversation'"
      >
        @if (conversation(); as conversation) {
          <!-- Header -->
          <vater-stack fill="horizontal" sticky="top" class="sticky-background">
            <vater-flex
              fill="horizontal"
              direction="row"
              justify="space-between"
              gap="m"
              class="watt-space-reverse-inset-stretch-m"
            >
              <vater-stack gap="s" align="start" fill="horizontal">
                <vater-stack direction="row" gap="xs">
                  @let initiatorRole = t('role.' + initiator()?.role);
                  <span class="watt-text-s">
                    @if (initiator()?.actorName; as actorName) {
                      {{ actorName }} ({{ initiatorRole }})
                    } @else {
                      {{ initiatorRole }}
                    }
                  </span>
                  <watt-icon name="right" size="xs" />
                  @let receiverRole = t('role.' + receiver()?.role);
                  <span class="watt-text-s">
                    @if (receiver()?.actorName; as actorName) {
                      {{ actorName }} ({{ receiverRole }})
                    } @else {
                      {{ receiverRole }}
                    }
                  </span>
                </vater-stack>
                <vater-stack direction="row" gap="s">
                  <h3 watt-heading>
                    {{ t('subjects.' + conversation.subject) }}
                  </h3>
                  @if (conversation.closed) {
                    <watt-badge type="neutral">{{ t('closed') }}</watt-badge>
                  }
                </vater-stack>
                <watt-description-list variant="inline-flow">
                  <watt-description-list-item
                    [label]="t('idLabel')"
                    [value]="conversation.displayId"
                  />
                  <watt-description-list-item
                    [label]="t('internalNoteLabel')"
                    [value]="conversation.internalNote"
                  />
                </watt-description-list>
                @if (
                  meteringPointId() === undefined && meteringPointConversationInfo();
                  as meteringPointInfo
                ) {
                  <watt-description-list variant="inline-flow" *transloco="let tBase">
                    <watt-description-list-item
                      [label]="
                        meteringPointInfo.meteringPointId +
                        ' • ' +
                        (meteringPointInfo.metadata.installationAddress?.streetName ?? '') +
                        ' ' +
                        (meteringPointInfo.metadata.installationAddress?.buildingNumber ?? '') +
                        ', ' +
                        (meteringPointInfo.metadata.installationAddress?.municipalityCode ?? '') +
                        ' ' +
                        (meteringPointInfo.metadata.installationAddress?.cityName ?? '')
                      "
                    />
                    <watt-description-list-item
                      [label]="t('meteringPointInfo.connectionState')"
                      [value]="
                        tBase(
                          'meteringPoint.overview.status.' +
                            meteringPointInfo.metadata.connectionState
                        )
                      "
                    />
                    <watt-description-list-item
                      [label]="t('meteringPointInfo.type')"
                      [value]="tBase('meteringPointType.' + meteringPointInfo.metadata.type)"
                    />
                    <watt-description-list-item
                      [label]="t('meteringPointInfo.resolution')"
                      [value]="tBase('resolution.' + meteringPointInfo.metadata.resolution)"
                    />
                  </watt-description-list>
                } @else if (
                  meteringPointId() === undefined && meteringPointConversationInfoQuery.loading()
                ) {
                  <vater-stack direction="row" wrap align="start" class="wrap-gap">
                    <watt-skeleton width="400px" height="20px" />
                    <watt-skeleton width="200px" height="20px" />
                    <watt-skeleton width="200px" height="20px" />
                    <watt-skeleton width="200px" height="20px" />
                  </vater-stack>
                }
              </vater-stack>

              <vater-stack direction="row" gap="m">
                <watt-button
                  [disabled]="conversation.closed"
                  (click)="closeConversation()"
                  variant="secondary"
                  >{{ t('closeCaseButton') }}
                </watt-button>
                <watt-button variant="secondary" [wattMenuTriggerFor]="menu">
                  <watt-icon name="moreVertical" />
                </watt-button>
                <watt-menu #menu>
                  <watt-menu-item (click)="openInternalNoteModal(conversation.internalNote)"
                    >{{ t('internalNoteLabel') }}
                  </watt-menu-item>
                  <watt-menu-item (click)="unreadConversation()"
                    >{{ t('markAsUnreadButton') }}
                  </watt-menu-item>
                </watt-menu>
              </vater-stack>
            </vater-flex>
            <watt-separator />
          </vater-stack>

          <!-- Content - Scrollable message area -->
          <vater-flex
            direction="column"
            fill="both"
            scrollable
            class="watt-space-reverse-inset-stretch-m no-padding-bottom"
          >
            <vater-stack direction="column" gap="m">
              @for (message of conversation.messages; track message) {
                <dh-actor-conversation-message [message]="message" />
              }
            </vater-stack>
            <div #scrollAnchor></div>
          </vater-flex>
        }
        <!-- Footer - Message input form -->
        @if (isPartOfConversation()) {
          <form
            vater
            sticky="bottom"
            class="watt-space-inset-ml sticky-background"
            fill="horizontal"
            (ngSubmit)="sendMessage()"
          >
            <dh-actor-conversation-message-form
              [loading]="uploading() || sendActorConversationMessageMutation.loading()"
              [closed]="!!conversation()?.closed"
              [uploadError]="uploadError()"
              [formControl]="formControl"
              [disableAnonymous]="disableAnonymous()"
            />
          </form>
        }
      </vater-flex>
    </dh-result>
  `,
})
export class DhActorConversationDetailsComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly uploadMessageDocument = injectUploadMessageDocument();
  private readonly modalService = inject(WattModalService);
  private readonly scrollAnchor = viewChild<ElementRef<HTMLElement>>('scrollAnchor');
  private readonly closeConversationMutation = mutation(CloseConversationDocument);
  private readonly scrollEffect = afterRenderEffect(() => {
    if (this.conversation()) {
      this.scrollAnchor()?.nativeElement.scrollIntoView();
    }
  });

  isPartOfConversation = computed(() => this.conversation()?.partOfConversations);
  sendActorConversationMessageMutation = mutation(SendActorConversationMessageDocument);
  unreadConversationMutation = mutation(MarkConversationUnReadDocument);
  conversationId = input.required<string>();
  meteringPointId = input<string | undefined>();

  conversationQuery = query(GetConversationDocument, () => ({
    returnPartialData: true,
    fetchPolicy: 'cache-and-network',
    variables: {
      conversationId: this.conversationId(),
    },
  }));

  conversation = computed(() => this.conversationQuery.data()?.conversation);

  meteringPointIdFromConversation = computed(
    () => this.conversation()?.meteringPointIdentification
  );

  meteringPointConversationInfoQuery = lazyQuery(GetMeteringPointConversationInfoDocument);

  private readonly fetchMeteringPointConversationInfo = effect(() => {
    const meteringPointId = this.meteringPointIdFromConversation();
    if (!meteringPointId) return;
    this.meteringPointConversationInfoQuery.refetch({ meteringPointId });
  });

  meteringPointConversationInfo = computed(
    () => this.meteringPointConversationInfoQuery.data()?.meteringPoint
  );

  readonly initiator = this.getParticipant(ParticipantType.Initiator);
  readonly receiver = this.getParticipant(ParticipantType.Receiver);

  disableAnonymous = computed(() => this.receiver()?.role === MarketRole.Energinet);

  private getParticipant(type: ParticipantType) {
    return computed(() => this.conversation()?.participants.find((p) => p.type === type));
  }

  private readonly clearMessageFormEffect = effect(() => {
    this.conversationId();
    this.clearMessageForm();
  });

  private readonly syncAnonymousEffect = effect(() => {
    const anonymous = this.conversation()?.wasLatestMessageAnonymous;
    if (anonymous !== undefined) {
      this.formControl.patchValue({
        content: this.formControl.value.content,
        anonymous,
        files: this.formControl.value.files ?? [],
      });
    }
  });

  uploading = signal(false);
  uploadError = signal(false);

  formControl = this.fb.control<MessageFormValue>({
    content: '',
    anonymous: false,
    files: [],
  });

  async closeConversation() {
    await this.closeConversationMutation.mutate({
      variables: {
        conversationId: this.conversationId(),
      },
      refetchQueries: [GetConversationDocument, GetConversationsDocument],
    });
  }

  openInternalNoteModal(internalNote: string | null | undefined) {
    this.modalService.open({
      component: DhActorConversationInternalNoteModalComponent,
      data: {
        conversationId: this.conversationId(),
        internalNote: internalNote ?? null,
      },
    });
  }

  async unreadConversation() {
    await this.unreadConversationMutation.mutate({
      variables: {
        conversationId: this.conversationId(),
      },
      refetchQueries: [GetConversationDocument, GetConversationsDocument],
    });
  }

  async sendMessage() {
    const { content, anonymous, files } = this.formControl.getRawValue();

    assertIsDefined(anonymous);

    if (!content && !(files ?? []).length) return;
    if (this.uploading()) return;

    this.uploadError.set(false);
    this.uploading.set(true);

    let attachedDocumentIds: string[];
    try {
      attachedDocumentIds = await Promise.all(
        (files ?? []).map((file) => this.uploadMessageDocument(file))
      );
    } catch {
      this.uploadError.set(true);
      this.uploading.set(false);
      return;
    }

    this.uploading.set(false);

    await this.sendActorConversationMessageMutation.mutate({
      variables: {
        conversationId: this.conversationId(),
        anonymous,
        content: content ?? '',
        attachedDocumentIds,
      },
      refetchQueries: [GetConversationDocument],
    });

    this.clearMessageForm();
  }

  private clearMessageForm() {
    this.formControl.patchValue({
      content: '',
      anonymous: this.formControl.value.anonymous ?? false,
      files: [],
    });
  }
}
