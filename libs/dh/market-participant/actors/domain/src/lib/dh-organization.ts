import type { ResultOf } from '@graphql-typed-document-node/core';

import {
  GetOrganizationByIdDocument,
  GetOrganizationsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

export type DhOrganization = ResultOf<typeof GetOrganizationsDocument>['organizations'][0];
export type DhOrganizationDetails = ResultOf<
  typeof GetOrganizationByIdDocument
>['organizationById'];
