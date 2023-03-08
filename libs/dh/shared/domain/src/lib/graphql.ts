/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { graphql, ResponseResolver, GraphQLRequest, GraphQLContext } from 'msw';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateRange: { start: string; end: string };
  DateTimeOffset: any;
  Decimal: any;
};

export type Actor = {
  __typename?: 'Actor';
  /** The number of the actor. */
  number: Scalars['String'];
};

export type Address = {
  __typename?: 'Address';
  /** The city of the address. */
  city?: Maybe<Scalars['String']>;
  /** The country of the address. */
  country: Scalars['String'];
  /** The number of the address. */
  number?: Maybe<Scalars['String']>;
  /** The street name of the address. */
  streetName?: Maybe<Scalars['String']>;
  /** The zip code of the address. */
  zipCode?: Maybe<Scalars['String']>;
};

export type Batch = {
  __typename?: 'Batch';
  /** The execution state. */
  executionState: BatchState;
  /** The execution end time. */
  executionTimeEnd?: Maybe<Scalars['DateTimeOffset']>;
  /** The execution start time. */
  executionTimeStart?: Maybe<Scalars['DateTimeOffset']>;
  gridAreas: Array<GridArea>;
  /** The id of the batch. */
  id: Scalars['ID'];
  /** Whether basis data is downloadable. */
  isBasisDataDownloadAvailable: Scalars['Boolean'];
  period?: Maybe<Scalars['DateRange']>;
  statusType: StatusType;
};

export enum BatchState {
  Completed = 'COMPLETED',
  Executing = 'EXECUTING',
  Failed = 'FAILED',
  Pending = 'PENDING',
}

export type GraphQlQuery = {
  __typename?: 'GraphQLQuery';
  batch?: Maybe<Batch>;
  batches: Array<Batch>;
  organization?: Maybe<Organization>;
  organizations?: Maybe<Array<Maybe<Organization>>>;
  permissions: Array<Permission>;
  processStep?: Maybe<ProcessStep>;
  settlementReports: Array<SettlementReport>;
};

export type GraphQlQueryBatchArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type GraphQlQueryBatchesArgs = {
  executionTime?: InputMaybe<Scalars['DateRange']>;
};

export type GraphQlQueryOrganizationArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type GraphQlQueryProcessStepArgs = {
  batchId: Scalars['ID'];
  gridArea: Scalars['String'];
  step: Scalars['Int'];
};

export type GraphQlQuerySettlementReportsArgs = {
  executionTime?: InputMaybe<Scalars['DateRange']>;
  gridAreaCodes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  period?: InputMaybe<Scalars['DateRange']>;
  processType?: InputMaybe<ProcessType>;
};

export type GridArea = {
  __typename?: 'GridArea';
  /** The grid area code. */
  code: Scalars['String'];
  /** The grid area id. */
  id: Scalars['ID'];
  /** The grid area name. */
  name: Scalars['String'];
  /** The price area code for the grid area. */
  priceAreaCode: PriceAreaCode;
  /** Date that the grid area is valid from */
  validFrom: Scalars['DateTimeOffset'];
  /** Date that the grid area is valid to */
  validTo?: Maybe<Scalars['DateTimeOffset']>;
};

export type Organization = {
  __typename?: 'Organization';
  /** The address of the organization. */
  address: Address;
  /** The business register identifier of the organization. */
  businessRegisterIdentifier: Scalars['String'];
  /** The comment of the organization. */
  comment: Scalars['String'];
  /** The name of the organization. */
  name: Scalars['String'];
  /** The ID of the organization. */
  organizationId: Scalars['ID'];
  /** The status of the organization. */
  status: OrganizationStatus;
};

export enum OrganizationStatus {
  Active = 'ACTIVE',
  Blocked = 'BLOCKED',
  Deleted = 'DELETED',
  New = 'NEW',
}

export type Permission = {
  __typename?: 'Permission';
  /** The description of the permission. */
  description: Scalars['String'];
  /** The ID of the permission. */
  id: Scalars['Int'];
  /** The name of the permission. */
  name: Scalars['String'];
};

export enum PriceAreaCode {
  Dk_1 = 'DK_1',
  Dk_2 = 'DK_2',
}

export type ProcessStep = {
  __typename?: 'ProcessStep';
  actors: Array<Actor>;
  result?: Maybe<ProcessStepResult>;
};

export type ProcessStepResultArgs = {
  gln?: InputMaybe<Scalars['String']>;
};

export type ProcessStepResult = {
  __typename?: 'ProcessStepResult';
  breadcrumb?: Maybe<Scalars['String']>;
  max: Scalars['Decimal'];
  min: Scalars['Decimal'];
  sum: Scalars['Decimal'];
  timeSeriesPoints: Array<TimeSeriesPoint>;
  timeSeriesType: TimeSeriesType;
};

export enum ProcessType {
  BalanceFixing = 'BALANCE_FIXING',
}

export type SettlementReport = {
  __typename?: 'SettlementReport';
  /** The execution time. */
  executionTime?: Maybe<Scalars['DateTimeOffset']>;
  /** The grid area. */
  gridArea: GridArea;
  period?: Maybe<Scalars['DateRange']>;
  /** The process type. */
  processType: ProcessType;
};

/** How the status should be represented visually. */
export enum StatusType {
  Danger = 'danger',
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
}

export type TimeSeriesPoint = {
  __typename?: 'TimeSeriesPoint';
  quality: Scalars['String'];
  quantity: Scalars['Decimal'];
  time: Scalars['DateTimeOffset'];
};

export enum TimeSeriesType {
  FlexConsumption = 'FLEX_CONSUMPTION',
  NonProfiledConsumption = 'NON_PROFILED_CONSUMPTION',
  Production = 'PRODUCTION',
}

export type GetPermissionsQueryVariables = Exact<{ [key: string]: never }>;

export type GetPermissionsQuery = {
  __typename?: 'GraphQLQuery';
  permissions: Array<{ __typename?: 'Permission'; id: number; name: string; description: string }>;
};

export type GetBatchQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetBatchQuery = {
  __typename?: 'GraphQLQuery';
  batch?: {
    __typename?: 'Batch';
    id: string;
    executionState: BatchState;
    executionTimeEnd?: any | null;
    executionTimeStart?: any | null;
    isBasisDataDownloadAvailable: boolean;
    period?: { start: string; end: string } | null;
    statusType: StatusType;
    gridAreas: Array<{
      __typename?: 'GridArea';
      code: string;
      name: string;
      id: string;
      priceAreaCode: PriceAreaCode;
      validFrom: any;
    }>;
  } | null;
};

export type GetBatchesQueryVariables = Exact<{
  executionTime?: InputMaybe<Scalars['DateRange']>;
}>;

export type GetBatchesQuery = {
  __typename?: 'GraphQLQuery';
  batches: Array<{
    __typename?: 'Batch';
    id: string;
    executionState: BatchState;
    executionTimeEnd?: any | null;
    executionTimeStart?: any | null;
    isBasisDataDownloadAvailable: boolean;
    period?: { start: string; end: string } | null;
    statusType: StatusType;
    gridAreas: Array<{ __typename?: 'GridArea'; code: string; name: string }>;
  }>;
};

export type GetProcessStepActorsQueryVariables = Exact<{
  step: Scalars['Int'];
  batchId: Scalars['ID'];
  gridArea: Scalars['String'];
}>;

export type GetProcessStepActorsQuery = {
  __typename?: 'GraphQLQuery';
  processStep?: {
    __typename?: 'ProcessStep';
    actors: Array<{ __typename?: 'Actor'; number: string }>;
  } | null;
};

export type GetProcessStepResultQueryVariables = Exact<{
  step: Scalars['Int'];
  batchId: Scalars['ID'];
  gridArea: Scalars['String'];
  gln: Scalars['String'];
}>;

export type GetProcessStepResultQuery = {
  __typename?: 'GraphQLQuery';
  processStep?: {
    __typename?: 'ProcessStep';
    result?: {
      __typename?: 'ProcessStepResult';
      breadcrumb?: string | null;
      min: any;
      max: any;
      sum: any;
      timeSeriesType: TimeSeriesType;
      timeSeriesPoints: Array<{
        __typename?: 'TimeSeriesPoint';
        quality: string;
        quantity: any;
        time: any;
      }>;
    } | null;
  } | null;
};

export type GetSettlementReportsQueryVariables = Exact<{
  period?: InputMaybe<Scalars['DateRange']>;
  executionTime?: InputMaybe<Scalars['DateRange']>;
}>;

export type GetSettlementReportsQuery = {
  __typename?: 'GraphQLQuery';
  settlementReports: Array<{
    __typename?: 'SettlementReport';
    processType: ProcessType;
    period?: { start: string; end: string } | null;
    executionTime?: any | null;
    gridArea: { __typename?: 'GridArea'; code: string; name: string };
  }>;
};

export const GetPermissionsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPermissions' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'permissions' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPermissionsQuery, GetPermissionsQueryVariables>;
export const GetBatchDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetBatch' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'batch' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'executionState' } },
                { kind: 'Field', name: { kind: 'Name', value: 'executionTimeEnd' } },
                { kind: 'Field', name: { kind: 'Name', value: 'executionTimeStart' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isBasisDataDownloadAvailable' } },
                { kind: 'Field', name: { kind: 'Name', value: 'period' } },
                { kind: 'Field', name: { kind: 'Name', value: 'statusType' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'gridAreas' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'priceAreaCode' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'validFrom' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetBatchQuery, GetBatchQueryVariables>;
export const GetBatchesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetBatches' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'executionTime' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'DateRange' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'batches' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'executionTime' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'executionTime' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'executionState' } },
                { kind: 'Field', name: { kind: 'Name', value: 'executionTimeEnd' } },
                { kind: 'Field', name: { kind: 'Name', value: 'executionTimeStart' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isBasisDataDownloadAvailable' } },
                { kind: 'Field', name: { kind: 'Name', value: 'period' } },
                { kind: 'Field', name: { kind: 'Name', value: 'statusType' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'gridAreas' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetBatchesQuery, GetBatchesQueryVariables>;
export const GetProcessStepActorsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetProcessStepActors' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'step' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'batchId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'gridArea' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'processStep' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'step' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'step' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'batchId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'batchId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'gridArea' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'gridArea' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actors' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'number' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetProcessStepActorsQuery, GetProcessStepActorsQueryVariables>;
export const GetProcessStepResultDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetProcessStepResult' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'step' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'batchId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'gridArea' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'gln' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'processStep' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'step' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'step' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'batchId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'batchId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'gridArea' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'gridArea' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'result' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'gln' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'gln' } },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'breadcrumb' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'min' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'max' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'sum' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'timeSeriesType' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'timeSeriesPoints' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'quality' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'time' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetProcessStepResultQuery, GetProcessStepResultQueryVariables>;
export const GetSettlementReportsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetSettlementReports' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'period' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'DateRange' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'executionTime' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'DateRange' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'settlementReports' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'period' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'period' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'executionTime' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'executionTime' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'processType' } },
                { kind: 'Field', name: { kind: 'Name', value: 'period' } },
                { kind: 'Field', name: { kind: 'Name', value: 'executionTime' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'gridArea' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSettlementReportsQuery, GetSettlementReportsQueryVariables>;

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionsQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ permissions })
 *   )
 * })
 */
export const mockGetPermissionsQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<GetPermissionsQueryVariables>,
    GraphQLContext<GetPermissionsQuery>,
    any
  >
) => graphql.query<GetPermissionsQuery, GetPermissionsQueryVariables>('GetPermissions', resolver);

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetBatchQuery((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ batch })
 *   )
 * })
 */
export const mockGetBatchQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<GetBatchQueryVariables>,
    GraphQLContext<GetBatchQuery>,
    any
  >
) => graphql.query<GetBatchQuery, GetBatchQueryVariables>('GetBatch', resolver);

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetBatchesQuery((req, res, ctx) => {
 *   const { executionTime } = req.variables;
 *   return res(
 *     ctx.data({ batches })
 *   )
 * })
 */
export const mockGetBatchesQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<GetBatchesQueryVariables>,
    GraphQLContext<GetBatchesQuery>,
    any
  >
) => graphql.query<GetBatchesQuery, GetBatchesQueryVariables>('GetBatches', resolver);

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetProcessStepActorsQuery((req, res, ctx) => {
 *   const { step, batchId, gridArea } = req.variables;
 *   return res(
 *     ctx.data({ processStep })
 *   )
 * })
 */
export const mockGetProcessStepActorsQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<GetProcessStepActorsQueryVariables>,
    GraphQLContext<GetProcessStepActorsQuery>,
    any
  >
) =>
  graphql.query<GetProcessStepActorsQuery, GetProcessStepActorsQueryVariables>(
    'GetProcessStepActors',
    resolver
  );

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetProcessStepResultQuery((req, res, ctx) => {
 *   const { step, batchId, gridArea, gln } = req.variables;
 *   return res(
 *     ctx.data({ processStep })
 *   )
 * })
 */
export const mockGetProcessStepResultQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<GetProcessStepResultQueryVariables>,
    GraphQLContext<GetProcessStepResultQuery>,
    any
  >
) =>
  graphql.query<GetProcessStepResultQuery, GetProcessStepResultQueryVariables>(
    'GetProcessStepResult',
    resolver
  );

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetSettlementReportsQuery((req, res, ctx) => {
 *   const { period, executionTime } = req.variables;
 *   return res(
 *     ctx.data({ settlementReports })
 *   )
 * })
 */
export const mockGetSettlementReportsQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<GetSettlementReportsQueryVariables>,
    GraphQLContext<GetSettlementReportsQuery>,
    any
  >
) =>
  graphql.query<GetSettlementReportsQuery, GetSettlementReportsQueryVariables>(
    'GetSettlementReports',
    resolver
  );
