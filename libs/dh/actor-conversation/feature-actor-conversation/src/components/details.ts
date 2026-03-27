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
import { DhActorConversationMessageForm } from './message-form';
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
import { DhActorConversationMessage } from './message';
import { DhActorConversationInternalNoteModal } from './internal-note-modal';
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
    DhActorConversationMessage,
    VaterFlexComponent,
    WattHeadingComponent,
    WattSeparatorComponent,
    WattSkeletonComponent,
    WATT_DESCRIPTION_LIST,
    DhActorConversationMessageForm,
  ],
  styles: `
    .sticky-background {
      background-color: var(--bg-card);
    }

    .no-padding-top {
      padding-top: 0;
    }

    .wrap-gap {
      column-gap: var(--watt-space-m);
      row-gap: var(--watt-space-xs);
    }
  `,
  templateUrl: './details.html',
})
export class DhActorConversationDetails {
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

  meteringPointInstallLabel = computed(() => {
    const info = this.meteringPointConversationInfo();
    if (!info) return '';

    const id = info.meteringPointId;
    const address = info.metadata.installationAddress;

    if (!address?.streetName?.trim()) return id;

    const isPresent = (v: string | null | undefined): v is string => v != null && v !== '';
    const streetPart = [address.streetName, address.buildingNumber].filter(isPresent).join(' ');
    const cityPart = [address.municipalityCode, address.cityName].filter(isPresent).join(' ');
    const addressParts = [streetPart, cityPart].filter(isPresent).join(', ');

    return `${id} • ${addressParts}`;
  });

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
      component: DhActorConversationInternalNoteModal,
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
