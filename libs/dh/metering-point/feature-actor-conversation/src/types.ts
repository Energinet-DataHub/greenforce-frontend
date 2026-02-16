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
  ActorType,
  ConversationSubject,
  GetConversationDocument,
  GetConversationsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import type { ResultOf } from '@graphql-typed-document-node/core';

export type ActorConversations = ResultOf<
  typeof GetConversationsDocument
>['conversationsForMeteringPoint']['conversations'];

export type ActorConversationDetail = ResultOf<typeof GetConversationDocument>['conversation'];

export enum ActorConversationState {
  noConversations = 'noConversations',
  noConversationSelected = 'noConversationSelected',
  conversationSelected = 'conversationSelected',
  newConversationOpen = 'newConversationOpen',
}

export type Conversation = ActorConversations[0];

export interface MessageFormValue {
  content: string | null;
  anonymous: boolean | null;
}

export type StartConversationFormValue = {
  subject: ConversationSubject;
  content: string;
  anonymous: boolean;
  receiver: ActorType;
  internalNote?: string;
};
