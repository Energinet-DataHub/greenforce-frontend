import { GetProcessesDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import type { ResultOf } from '@graphql-typed-document-node/core';

export type Processes = NonNullable<ResultOf<typeof GetProcessesDocument>['processes']>['nodes'];
export type Process = NonNullable<Processes>[0];
