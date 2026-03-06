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
import { http, delay, HttpResponse } from 'msw';

import {
  MarketParticipant,
  GetMarketParticipantEditableFieldsQuery,
  OrganizationAuditedChangeAuditLogDto,
  OrganizationAuditedChange,
  UpdateMarketParticipantMutation,
  CreateDelegationForMarketParticipantMutation,
  StopDelegationsMutation,
  GridAreaAuditedChangeAuditLogDto,
  GridAreaAuditedChange,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  mockGetMarketParticipantByIdQuery,
  mockGetMarketParticipantEditableFieldsQuery,
  mockGetMarketParticipantsByOrganizationIdQuery,
  mockGetMarketParticipantsQuery,
  mockGetAuditLogByOrganizationIdQuery,
  mockGetGridAreaOverviewQuery,
  mockCreateMarketParticipantMutation,
  mockGetAssociatedMarketParticipantsQuery,
  mockUpdateMarketParticipantMutation,
  mockGetDelegationsForMarketParticipantQuery,
  mockGetDelegatesQuery,
  mockCreateDelegationForMarketParticipantMutation,
  mockStopDelegationsMutation,
  mockGetMarketParticipantsForEicFunctionQuery,
  mockGetBalanceResponsibleRelationQuery,
  mockGetMarketParticipantCredentialsQuery,
  mockAddTokenToDownloadUrlMutation,
  mockCheckDomainExistsQuery,
  mockMergeMarketParticipantsMutation,
  mockGetGridAreaDetailsQuery,
  mockGetMarketParticipantAuditLogsQuery,
  mockGetMarketParticipantDetailsQuery,
  mockGetGridAreasQuery,
  mockGetRelevantGridAreasQuery,
  mockGetMarketParticipantOptionsQuery,
  mockGetAdditionalRecipientOfMeasurementsQuery,
  mockAddMeteringPointsToAdditionalRecipientMutation,
  mockRemoveMeteringPointsFromAdditionalRecipientMutation,
  mockGetPaginatedMarketParticipantsQuery,
  mockCheckEmailExistsQuery,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';

import { marketParticipants } from './data/market-participants';
import { getMarketParticipantAuditLogsMock } from './data/get-actor-audit-logs';
import { getGridAreaOverviewMock } from './data/get-grid-area-overview';

import { getDelegationsForMarketParticipantMock } from './data/get-delegations-for-actor';
import { marketParticipantsById } from './data/get-actors-by-organizationId';
import { balanceResponsibleAgreements } from './data/balance-responsible-agreements';
import { getGridAreas } from './data/get-grid-areas';

export function marketParticipantMocks(apiBase: string) {
  return [
    getMarketParticipants(),
    getMarketParticipantById(),
    getMarketParticipantDetails(),
    getMarketParticipantEditableFields(),
    getMarketParticipantOptions(),
    getMarketParticipantByOrganizationId(),
    updateMarketParticipant(),
    getAuditLogByOrganizationId(),
    getMarketParticipantAuditLogsQuery(),
    getMarketParticipantCredentials(apiBase),
    marketParticipantAssignCertificateCredentials(apiBase),
    marketParticipantRemoveActorCredentials(apiBase),
    getGridAreaOverview(),
    getGridAreaDetails(),
    createMarketParticipant(),
    getAssociatedMarketParticipants(),
    getDelegationsForMarketParticipant(),
    getDelegates(),
    createDelegation(),
    stopDelegation(),
    getMarketParticipantsForEicFunction(),
    getBalanceResponsibleRelation(),
    addTokenToDownloadUrl(),
    checkDomainExists(),
    checkEmailExists(),
    mergeMarketParticipants(),
    getGridAreasQuery(),
    getRelevantGridAreasQuery(),
    getAdditionalRecipientOfMeasurements(),
    addMeteringPointsToAdditionalRecipient(),
    removeMeteringPointsFromAdditionalRecipient(),
    getPaginatedMarketParticipants(),
  ];
}

function getMarketParticipants() {
  return mockGetMarketParticipantsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: { __typename: 'Query', marketParticipants },
    });
  });
}

function getMarketParticipantById() {
  return mockGetMarketParticipantByIdQuery(async ({ variables }) => {
    const { id } = variables;

    const marketParticipantById = marketParticipants.find((a) => a.id === id) as MarketParticipant;

    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: { __typename: 'Query', marketParticipantById },
    });
  });
}

function getMarketParticipantDetails() {
  return mockGetMarketParticipantDetailsQuery(async ({ variables }) => {
    const { id } = variables;

    const marketParticipantById = marketParticipants.find((a) => a.id === id) as MarketParticipant;

    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: { __typename: 'Query', marketParticipantById },
    });
  });
}

function getMarketParticipantOptions() {
  return mockGetMarketParticipantOptionsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        marketParticipants: marketParticipants.map((x) => ({
          __typename: x.__typename,
          value: x.id,
          displayValue: x.displayName,
        })),
      },
    });
  });
}

function getMarketParticipantEditableFields() {
  return mockGetMarketParticipantEditableFieldsQuery(async () => {
    await delay(mswConfig.delay);

    const query: GetMarketParticipantEditableFieldsQuery = {
      __typename: 'Query',
      marketParticipantById: {
        id: '00000000-0000-0000-0000-000000000005',
        __typename: 'MarketParticipant',
        name: 'Test Actor 1',
        organization: {
          __typename: 'Organization',
          id: 'organization-id-1',
          domains: ['fake-domain.dk', 'test.dk'],
        },
        contact: {
          __typename: 'ActorContactDto',
          name: 'Test Department',
          email: 'test-actor@fake-domain.dk',
          phone: '+45 22334455',
        },
      },
    };

    return HttpResponse.json({
      data: query,
    });
  });
}

function getDelegates() {
  return mockGetDelegatesQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        marketParticipantsForEicFunction: [
          {
            __typename: 'MarketParticipant',
            id: '00000000-0000-0000-0000-000000000002',
            name: 'Test Actor 2',
            glnOrEicNumber: '22222222',
            displayName: 'Test Actor 2 • 22222222',
          },
          {
            __typename: 'MarketParticipant',
            id: '00000000-0000-0000-0000-000000000003',
            name: 'Test Actor 3',
            glnOrEicNumber: '33333333',
            displayName: 'Test Actor 3 • 33333333',
          },
          {
            __typename: 'MarketParticipant',
            id: '00000000-0000-0000-0000-000000000004',
            name: 'Test Actor 4',
            glnOrEicNumber: '44444444444',
            displayName: 'Test Actor 4 • 44444444444',
          },
        ],
      },
    });
  });
}

function getMarketParticipantByOrganizationId() {
  return mockGetMarketParticipantsByOrganizationIdQuery(async ({ variables }) => {
    const { organizationId } = variables;

    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        marketParticipantsByOrganizationId: marketParticipantsById(organizationId),
      },
    });
  });
}

function createDelegation() {
  return mockCreateDelegationForMarketParticipantMutation(async () => {
    await delay(mswConfig.delay);
    const mockError = Math.random() < 0.5;

    const response: CreateDelegationForMarketParticipantMutation = {
      __typename: 'Mutation',
      createDelegationsForMarketParticipant: {
        __typename: 'CreateDelegationsForMarketParticipantPayload',
        success: !mockError,
        errors: mockError
          ? [
              {
                __typename: 'ApiError',
                apiErrors: [
                  {
                    __typename: 'ApiErrorDescriptor',
                    code: 'market_participant.validation.process_delegation.actors_from_or_to_inactive',
                    message: 'mock fail',
                    args: [],
                  },
                ],
              },
            ]
          : [],
      },
    };
    return HttpResponse.json({
      data: response,
    });
  });
}

function stopDelegation() {
  return mockStopDelegationsMutation(async (request) => {
    const mockError =
      request.variables.input.stopDelegationPeriods[0].stopPeriod.periodId ===
      getDelegationsForMarketParticipantMock.marketParticipantById.delegations[0].periodId;
    await delay(mswConfig.delay);
    const response: StopDelegationsMutation = {
      __typename: 'Mutation',
      stopDelegation: {
        __typename: 'StopDelegationPayload',
        success: !mockError,
        errors: mockError
          ? [
              {
                __typename: 'ApiError',
                apiErrors: [
                  {
                    __typename: 'ApiErrorDescriptor',
                    code: 'test',
                    message: 'mock fail',
                    args: [],
                  },
                ],
              },
            ]
          : [],
      },
    };
    return HttpResponse.json({
      data: response,
    });
  });
}

function updateMarketParticipant() {
  return mockUpdateMarketParticipantMutation(async () => {
    const response: UpdateMarketParticipantMutation = {
      __typename: 'Mutation',
      updateMarketParticipant: {
        __typename: 'UpdateMarketParticipantPayload',
        errors: null,
      },
    };

    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: response,
    });
  });
}

function getAuditLogByOrganizationId() {
  return mockGetAuditLogByOrganizationIdQuery(async () => {
    const auditLog: OrganizationAuditedChangeAuditLogDto[] = [
      {
        __typename: 'OrganizationAuditedChangeAuditLogDto',
        auditedBy: 'Jane Doe',
        isInitialAssignment: false,
        currentValue: 'energinet.dk',
        previousValue: null,
        change: OrganizationAuditedChange.Domain,
        timestamp: new Date('2021-09-05T10:00:00'),
      },
      {
        __typename: 'OrganizationAuditedChangeAuditLogDto',
        auditedBy: 'Jane Doe',
        isInitialAssignment: false,
        currentValue: 'Grøn Strøm',
        previousValue: null,
        change: OrganizationAuditedChange.Name,
        timestamp: new Date('2021-09-06T10:00:00'),
      },
    ];

    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        organizationById: { __typename: 'Organization', auditLogs: auditLog, id: '1' },
      },
    });
  });
}

function getMarketParticipantAuditLogsQuery() {
  return mockGetMarketParticipantAuditLogsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: getMarketParticipantAuditLogsMock,
    });
  });
}

function getMarketParticipantCredentials(apiBase: string) {
  return mockGetMarketParticipantCredentialsQuery(
    async ({ variables: { marketParticipantId } }) => {
      await delay(mswConfig.delay);
      return HttpResponse.json({
        data: {
          __typename: 'Query',
          marketParticipantById: {
            __typename: 'MarketParticipant',
            id: marketParticipantId,
            credentials: {
              __typename: 'ActorCredentialsDto',
              certificateCredentials: null,
              assignCertificateCredentialsUrl: `${apiBase}/v1/MarketParticipant/AssignCertificateCredentials`,
              removeMarketParticipantCredentialsUrl: `${apiBase}/v1/MarketParticipant/RemoveMarketParticipantCredentials`,
              clientSecretCredentials: {
                __typename: 'ActorClientSecretCredentialsDto',
                clientSecretIdentifier: 'random-secret-XEi33WhFi8qwnCzrnlf',
                expirationDate: new Date('2022-09-01'),
              },
            },
          },
        },
      });
    }
  );
}

function marketParticipantAssignCertificateCredentials(apiBase: string) {
  return http.post(`${apiBase}/v1/MarketParticipant/AssignCertificateCredentials`, async () => {
    await delay(mswConfig.delay);
    return new HttpResponse(null, { status: 200 });
  });
}

function marketParticipantRemoveActorCredentials(apiBase: string) {
  return http.delete(`${apiBase}/v1/MarketParticipant/RemoveActorCredentials`, async () => {
    await delay(mswConfig.delay);
    return new HttpResponse(null, { status: 200 });
  });
}

function getGridAreaOverview() {
  return mockGetGridAreaOverviewQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: getGridAreaOverviewMock,
    });
  });
}

function getGridAreaDetails() {
  return mockGetGridAreaDetailsQuery(async ({ variables }) => {
    const { id } = variables;

    await delay(mswConfig.delay);

    const gridArea = (getGridAreaOverviewMock?.gridAreaOverviewItems?.nodes ?? []).find(
      (x) => x.id === id
    );

    if (gridArea === undefined) {
      return HttpResponse.json({
        data: null,
      });
    }

    const auditLogs: GridAreaAuditedChangeAuditLogDto[] = [
      {
        __typename: 'GridAreaAuditedChangeAuditLogDto',
        auditedBy: 'Test 1 (test@energinet.dk)',
        isInitialAssignment: false,
        currentValue: '---',
        previousValue: null,
        change: GridAreaAuditedChange.ConsolidationRequested,
        timestamp: new Date('2023-12-01T22:59:59Z'),
        previousOwner: 'Det Sorte Net',
        currentOwner: 'Det Grønne Net',
      },
      {
        __typename: 'GridAreaAuditedChangeAuditLogDto',
        auditedBy: '---',
        isInitialAssignment: false,
        currentValue: '---',
        previousValue: null,
        change: GridAreaAuditedChange.Decommissioned,
        timestamp: new Date('2023-12-09T22:59:59Z'),
        previousOwner: null,
        currentOwner: null,
      },
      {
        __typename: 'GridAreaAuditedChangeAuditLogDto',
        auditedBy: '---',
        isInitialAssignment: false,
        currentValue: '---',
        previousValue: null,
        change: GridAreaAuditedChange.ConsolidationCompleted,
        timestamp: new Date('2023-12-09T22:59:59Z'),
        previousOwner: null,
        currentOwner: 'Det Grønne Net',
      },
    ];

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        gridAreaOverviewItemById: {
          ...gridArea,
          auditLog: auditLogs,
        },
      },
    });
  });
}

function createMarketParticipant() {
  return mockCreateMarketParticipantMutation(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        createMarketParticipant: {
          __typename: 'CreateMarketParticipantPayload',
          success: true,
          errors: [],
        },
      },
    });
  });
}

function getAssociatedMarketParticipants() {
  return mockGetAssociatedMarketParticipantsQuery(async ({ variables }) => {
    const { email } = variables;

    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        associatedMarketParticipants: {
          __typename: 'AssociatedMarketParticipants',
          email,
          marketParticipants:
            email === 'testuser1@test.dk' ? ['00000000-0000-0000-0000-000000000001'] : [],
        },
      },
    });
  });
}

function getDelegationsForMarketParticipant() {
  return mockGetDelegationsForMarketParticipantQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: getDelegationsForMarketParticipantMock,
    });
  });
}

function getMarketParticipantsForEicFunction() {
  return mockGetMarketParticipantsForEicFunctionQuery(async ({ variables }) => {
    const { eicFunctions } = variables;
    await delay(mswConfig.delay);

    const marketParticipantsForEicFunction = marketParticipants.filter(
      (x) => eicFunctions && x.marketRole && eicFunctions.includes(x.marketRole)
    );

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        marketParticipantsForEicFunction,
      },
    });
  });
}

function getBalanceResponsibleRelation() {
  return mockGetBalanceResponsibleRelationQuery(async ({ variables }) => {
    const { id } = variables;
    await delay(mswConfig.delay);

    if (id === 'efad0fee-9d7c-49c6-7c20-08da5f28ddb1') {
      if (Math.random() > 0.5) {
        return HttpResponse.json({
          errors: [
            {
              message: 'Failed to fetch balance responsible agreements',
              extensions: { code: '500', details: 'test' },
            },
          ],
          data: null,
        });
      }

      return HttpResponse.json({
        data: {
          __typename: 'Query',
          marketParticipantById: {
            id: 'efad0fee-9d7c-49c6-7c20-08da5f28ddb1',
            __typename: 'MarketParticipant',
            balanceResponsibleAgreements: [],
          },
        },
      });
    }

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        marketParticipantById: {
          id: '00000000-0000-0000-0000-000000000006',
          __typename: 'MarketParticipant',
          balanceResponsibleAgreements,
        },
      },
    });
  });
}

function addTokenToDownloadUrl() {
  return mockAddTokenToDownloadUrlMutation(async ({ variables }) => {
    const { url } = variables;
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        addTokenToDownloadUrl: {
          __typename: 'AddTokenToDownloadUrlPayload',
          downloadUrlWithToken: `${url}?token=12345`,
        },
      },
    });
  });
}

function checkDomainExists() {
  return mockCheckDomainExistsQuery(async ({ variables }) => {
    const { email } = variables;
    const domain = email.split('@')[1];

    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        domainExists: ['test.dk', 'datahub.dk', 'energinet.dk'].includes(domain),
      },
    });
  });
}

function checkEmailExists() {
  return mockCheckEmailExistsQuery(async ({ variables }) => {
    const { email } = variables;

    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        emailExists: 'test@energinet.dk' === email,
      },
    });
  });
}

function mergeMarketParticipants() {
  return mockMergeMarketParticipantsMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        mergeMarketParticipants: {
          __typename: 'MergeMarketParticipantsPayload',
          success: true,
          errors: [],
        },
      },
    });
  });
}

function getGridAreasQuery() {
  return mockGetGridAreasQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({ data: getGridAreas });
  });
}

function getRelevantGridAreasQuery() {
  return mockGetRelevantGridAreasQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        relevantGridAreas: getGridAreas.gridAreas,
      },
    });
  });
}

function getAdditionalRecipientOfMeasurements() {
  return mockGetAdditionalRecipientOfMeasurementsQuery(async ({ variables }) => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        marketParticipantById: {
          __typename: 'MarketParticipant',
          id: variables.marketParticipantId,
          additionalRecipientForMeasurements: ['1234567890', '0987654321'],
        },
      },
    });
  });
}

function addMeteringPointsToAdditionalRecipient() {
  return mockAddMeteringPointsToAdditionalRecipientMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        addMeteringPointsToAdditionalRecipient: {
          __typename: 'AddMeteringPointsToAdditionalRecipientPayload',
          success: true,
          errors: [],
        },
      },
    });
  });
}

function removeMeteringPointsFromAdditionalRecipient() {
  return mockRemoveMeteringPointsFromAdditionalRecipientMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        removeMeteringPointsFromAdditionalRecipient: {
          __typename: 'RemoveMeteringPointsFromAdditionalRecipientPayload',
          success: true,
          errors: [],
        },
      },
    });
  });
}

function getPaginatedMarketParticipants() {
  return mockGetPaginatedMarketParticipantsQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        paginatedMarketParticipants: {
          __typename: 'PaginatedMarketParticipantsConnection',
          totalCount: marketParticipants.length,
          pageInfo: {
            __typename: 'PageInfo',
            startCursor: null,
            endCursor: null,
          },
          nodes: marketParticipants,
        },
      },
    });
  });
}
