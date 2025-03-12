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
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import {
  CheckDomainExistsDocument,
  GetAssociatedActorsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

export function validateIfAlreadyAssociatedToActor(
  getActorId: () => string | null
): AsyncValidatorFn {
  const checkForAssociatedActorsQuery = lazyQuery(GetAssociatedActorsDocument);
  return (control: AbstractControl) => {
    const actorId = getActorId();
    if (!control.value || actorId === null) {
      return Promise.resolve(null);
    }
    return checkForAssociatedActorsQuery
      .query({ variables: { email: control.value } })
      .then((result) => {
        const associatedActors = result.data?.associatedActors.actors ?? [];

        const isAlreadyAssociatedToActor = associatedActors?.includes(actorId);

        return isAlreadyAssociatedToActor ? { userAlreadyAssignedActor: true } : null;
      });
  };
}

export function validateIfDomainExists(): AsyncValidatorFn {
  const validDomainQuery = lazyQuery(CheckDomainExistsDocument);
  return (control: AbstractControl) => {
    if (!control.value) {
      return Promise.resolve(null);
    }
    return validDomainQuery.query({ variables: { email: control.value } }).then((domainCheck) => {
      return !domainCheck.data?.domainExists ? { domainDoesNotExist: true } : null;
    });
  };
}
