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
import { GetUserByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import type { ResultOf } from '@graphql-typed-document-node/core';

export type DhUser = ResultOf<typeof GetUserByIdDocument>['userById'];

export type DhActorUser = DhUser['actors'][0];

export type DhActorUserRoles = DhActorUser['userRoles'];

export type DhActorUserRole = DhActorUserRoles[0];

export type DhUsers = DhUser[];
