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
import { WattIconComponent } from '@energinet/watt/icon';
import {
  VaterFlexComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet/watt/vater';
import { WattBadgeComponent } from '@energinet/watt/badge';
import { WattButtonComponent } from '@energinet/watt/button';
import {
  WattMenuComponent,
  WattMenuItemComponent,
  WattMenuTriggerDirective,
} from '@energinet/watt/menu';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { MessageFormValue } from '../types';
import { DhActorConversationMessageFormComponent } from './actor-conversation-message-form.component';
import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  CloseConversationDocument,
  GetConversationDocument,
  GetConversationsDocument,
  GetMeteringPointConversationInfoDocument,
  MarkConversationUnReadDocument,
  ParticipantType,
  SendActorConversationMessageDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattModalService } from '@energinet/watt/modal';
import { DhResultComponent, injectToast } from '@energinet-datahub/dh/shared/ui-util';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { DhActorConversationMessageComponent } from './actor-conversation-message';
import { DhActorConversationInternalNoteModalComponent } from './actor-conversation-internal-note-modal.component';
import { injectUploadMessageDocument } from './upload-message-document';
import { WattHeadingComponent } from '@energinet/watt/heading';
import { WattSeparatorComponent } from '@energinet/watt/separator';
import { WattSkeletonComponent } from '@energinet/watt/skeleton';

@Component({
  selector: 'dh-actor-conversation-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WattIconComponent,
    VaterStackComponent,
    WattBadgeComponent,
    WattButtonComponent,
    WattMenuComponent,
    WattMenuItemComponent,
    WattMenuTriggerDirective,
    VaterUtilityDirective,
    TranslocoDirective,
    ReactiveFormsModule,
    DhActorConversationMessageFormComponent,
    FormsModule,
    DhResultComponent,
    DhActorConversationMessageComponent,
    VaterFlexComponent,
    WattHeadingComponent,
    WattSeparatorComponent,
    WattSkeletonComponent,
  ],
  styles: `
    .sticky-background {
      background-color: var(--bg-card);
    }

    .no-padding-bottom {
      padding-bottom: 0;
    }

    .no-min-width {
      min-width: 0;
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
            <vater-stack
              fill="horizontal"
              direction="row"
              justify="space-between"
              gap="m"
              class="watt-space-reverse-inset-stretch-m"
            >
              <vater-stack gap="s" align="start" fill="horizontal" class="no-min-width">
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
                <vater-stack direction="row" gap="m">
                  <vater-stack direction="row" gap="xs">
                    <label>ID</label>
                    <span class="watt-text-s">{{ conversation.displayId }}</span>
                  </vater-stack>
                  <vater-stack direction="row" gap="xs">
                    <label>{{ t('internalNoteLabel') }}</label>
                    <span class="watt-text-s">{{ conversation.internalNote }}</span>
                  </vater-stack>
                </vater-stack>
                @if (meteringPointConversationInfo(); as meteringPointInfo) {
                  <vater-stack
                    direction="row"
                    wrap
                    align="start"
                    class="wrap-gap"
                    *transloco="let tBase"
                  >
                    <label
                      >{{ conversation.meteringPointIdentification }} •
                      {{ meteringPointInfo.metadata.installationAddress?.streetName }}
                      {{ meteringPointInfo.metadata.installationAddress?.buildingNumber }} ,
                      {{ meteringPointInfo.metadata.installationAddress?.municipalityCode }}
                      {{ meteringPointInfo.metadata.installationAddress?.cityName }}</label
                    >
                    <vater-stack direction="row" gap="xs">
                      <label>{{ t('meteringPointInfo.connectionState') }}</label>
                      <span class="watt-text-s">{{
                        tBase(
                          'meteringPoint.overview.status.' +
                            meteringPointInfo.metadata.connectionState
                        )
                      }}</span>
                    </vater-stack>
                    <vater-stack direction="row" gap="xs">
                      <label>{{ t('meteringPointInfo.type') }}</label>
                      <span class="watt-text-s">{{
                        tBase('meteringPointType.' + meteringPointInfo.metadata.type)
                      }}</span>
                    </vater-stack>
                    <vater-stack direction="row" gap="xs">
                      <label>{{ t('meteringPointInfo.resolution') }}</label>
                      <span class="watt-text-s">{{
                        tBase('resolution.' + meteringPointInfo.metadata.resolution)
                      }}</span>
                    </vater-stack>
                  </vater-stack>
                } @else {
                  <vater-stack fill="horizontal" direction="row" gap="m">
                    <watt-skeleton />
                    <watt-skeleton />
                    <watt-skeleton />
                    <watt-skeleton />
                    <watt-skeleton />
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
            </vater-stack>
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
          />
        </form>
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
  private readonly closeToast = injectToast(
    'meteringPoint.actorConversation.conversationCloseError'
  );
  private readonly closeToastEffect = effect(() =>
    this.closeToast(this.closeConversationMutation.status())
  );
  private readonly scrollEffect = afterRenderEffect(() => {
    if (this.conversation()) {
      this.scrollAnchor()?.nativeElement.scrollIntoView();
    }
  });
  sendActorConversationMessageMutation = mutation(SendActorConversationMessageDocument);
  unreadConversationMutation = mutation(MarkConversationUnReadDocument);
  conversationId = input.required<string>();

  conversationQuery = query(GetConversationDocument, () => ({
    variables: {
      conversationId: this.conversationId(),
    },
  }));

  conversation = computed(() => this.conversationQuery.data()?.conversation);

  meteringPointId = computed(() => this.conversation()?.meteringPointIdentification);

  meteringPointConversationInfoQuery = query(GetMeteringPointConversationInfoDocument, () => {
    const meteringPointId = this.meteringPointId();
    if (!meteringPointId) return { skip: true as const };
    return {
      variables: {
        meteringPointId,
      },
    };
  });

  meteringPointConversationInfo = computed(
    () => this.meteringPointConversationInfoQuery.data()?.meteringPoint
  );

  readonly initiator = this.getParticipant(ParticipantType.Initiator);
  readonly receiver = this.getParticipant(ParticipantType.Receiver);

  private getParticipant(type: ParticipantType) {
    return computed(() => this.conversation()?.participants.find((p) => p.type === type));
  }

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
      refetchQueries: [GetConversationDocument, GetConversationsDocument],
    });

    this.formControl.patchValue({
      content: '',
      anonymous: this.formControl.value.anonymous ?? false,
      files: [],
    });
  }
}
