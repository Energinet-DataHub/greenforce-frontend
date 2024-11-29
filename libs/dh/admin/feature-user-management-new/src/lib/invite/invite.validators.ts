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
      return !domainCheck.data.domainExists ? { domainDoesNotExist: true } : null;
    });
  };
}
