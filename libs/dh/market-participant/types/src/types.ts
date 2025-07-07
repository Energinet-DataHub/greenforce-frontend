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
  ActorStatus,
  EicFunction,
  GetOrganizationByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import type { ResultOf } from '@graphql-typed-document-node/core';

import {
  GetActorAuditLogsDocument,
  GetActorByIdDocument,
  GetActorDetailsDocument,
  GetActorsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

export interface ActorsFilters {
  actorStatus: ActorStatus[] | null;
  marketRoles: EicFunction[] | null;
}

export type AllFiltersCombined = ActorsFilters & { searchInput: string };

import { FormGroup, FormControl } from '@angular/forms';

export type DhActorForm = FormGroup<{
  glnOrEicNumber: FormControl<string>;
  name: FormControl<string>;
  marketrole: FormControl<EicFunction | null>;
  gridArea: FormControl<string[]>;
  contact: FormGroup<{
    departmentOrName: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
  }>;
}>;

export type DhActor = ResultOf<typeof GetActorsDocument>['actors'][0];
export type DhActorExtended = ResultOf<typeof GetActorByIdDocument>['actorById'];

export type DhActorDetails = ResultOf<typeof GetActorDetailsDocument>['actorById'];

export type DhActorAuditLog = ResultOf<
  typeof GetActorAuditLogsDocument
>['actorById']['auditLogs'][0];

export type DhOrganizationDetails = ResultOf<
  typeof GetOrganizationByIdDocument
>['organizationById'];
