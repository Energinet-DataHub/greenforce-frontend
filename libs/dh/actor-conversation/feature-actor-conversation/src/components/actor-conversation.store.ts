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
import { computed, Injectable, signal } from '@angular/core';
import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  GetConversationsDocument,
  MarkConversationReadDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { ActorConversationState, Conversation } from '../types';

/**
 * Manages shared actor conversation state.
 *
 * Provided at the shell component level (not root), so each shell
 * gets its own isolated instance.
 */
@Injectable()
export class ActorConversationStore {
  private readonly searchTerm = signal<string | undefined>(undefined);
  private readonly meteringPointId = signal<string | undefined>(undefined);
  private readonly _newConversationVisible = signal(false);
  private readonly _selectedConversationId = signal<string | undefined>(undefined);

  readonly readConversationMutation = mutation(MarkConversationReadDocument);

  readonly conversationsQuery = query(GetConversationsDocument, () => ({
    variables: {
      meteringPointIdentification: this.meteringPointId(),
      searchTerm: this.searchTerm(),
    },
  }));

  readonly conversations = computed(
    () => this.conversationsQuery.data()?.conversationsForMeteringPoint?.conversations ?? []
  );

  readonly newConversationVisible = this._newConversationVisible.asReadonly();
  readonly selectedConversationId = this._selectedConversationId.asReadonly();

  readonly state = computed<ActorConversationState>(() => {
    if (this._newConversationVisible()) {
      return ActorConversationState.newConversationOpen;
    } else if (this.conversations().length === 0) {
      return ActorConversationState.noConversations;
    } else if (this._selectedConversationId() === undefined) {
      return ActorConversationState.noConversationSelected;
    }
    return ActorConversationState.conversationSelected;
  });

  setMeteringPointId(id: string | undefined) {
    this.meteringPointId.set(id);
  }

  search(term: string) {
    this.searchTerm.set(term);
  }

  openNewConversation() {
    this._newConversationVisible.set(true);
    this._selectedConversationId.set(undefined);
  }

  closeNewConversation(newConversationId?: string) {
    this._newConversationVisible.set(false);
    if (newConversationId) {
      this._selectedConversationId.set(newConversationId);
    }
  }

  async selectConversation(conversation: Conversation) {
    this._newConversationVisible.set(false);
    this._selectedConversationId.set(conversation.id);
    if (conversation.read) return;
    await this.readConversationMutation.mutate({
      variables: {
        conversationId: conversation.id,
      },
      refetchQueries: [GetConversationsDocument],
    });
  }
}

