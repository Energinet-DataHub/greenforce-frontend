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
//#region License
import { ConversationInfo } from '@energinet-datahub/dh/shared/domain/graphql';

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

export const conversations: ConversationInfo[] = [
  {
    __typename: 'ConversationInfo',
    conversationId: '00001',
    closed: false,
    read: false,
    lastUpdated: new Date(),
    subject: 'QUESTION_FOR_ENERGINET',
    meteringPointIdentification: '222222222222222222'
  },
  {
    __typename: 'ConversationInfo',
    conversationId: '00002',
    closed: false,
    read: true,
    lastUpdated: new Date(),
    subject: 'QUESTION_FOR_ENERGINET',
    meteringPointIdentification: '222222222222222222'
  },
  {
    __typename: 'ConversationInfo',
    conversationId: '00003',
    closed: true,
    read: true,
    lastUpdated: new Date(),
    subject: 'QUESTION_FOR_ENERGINET',
    meteringPointIdentification: '222222222222222222'
  },
];
