// Copyright 2020 Energinet DataHub A/S
//
// Licensed under the Apache License, Version 2.0 (the "License2");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using HotChocolate;
using HotChocolate.Types;
using NodaTime;
using EdiB2CWebAppProcessType = Energinet.DataHub.Edi.B2CWebApp.Clients.v1.ProcessType;
using WholesaleCalculationType = Energinet.DataHub.WebApi.Clients.Wholesale.v3.CalculationType;

namespace Energinet.DataHub.WebApi.GraphQL;

public class Mutation
{
    [UseMutationConvention(Disable = true)]
    public Task<PermissionDto> UpdatePermissionAsync(
        UpdatePermissionDto input,
        [Service] IMarketParticipantClient_V1 client) =>
        client
            .PermissionPutAsync(input)
            .Then(() => client.PermissionGetAsync(input.Id));

    [Error(typeof(Clients.MarketParticipant.v1.ApiException))]
    public async Task<bool> UpdateActorAsync(
        Guid actorId,
        string actorName,
        string departmentName,
        string departmentEmail,
        string departmentPhone,
        [Service] IMarketParticipantClient_V1 client)
    {
        var actor = await client.ActorGetAsync(actorId).ConfigureAwait(false);
        if (!string.Equals(actor.Name.Value, actorName, StringComparison.Ordinal))
        {
            await client.ActorNameAsync(actorId, new ActorNameDto { Value = actorName }).ConfigureAwait(false);
        }

        var allContacts = await client.ActorContactGetAsync(actorId).ConfigureAwait(false);
        var defaultContact = allContacts.SingleOrDefault(c => c.Category == ContactCategory.Default);
        if (defaultContact == null ||
            !string.Equals(defaultContact.Name, departmentName, StringComparison.Ordinal) ||
            !string.Equals(defaultContact.Email, departmentEmail, StringComparison.Ordinal) ||
            !string.Equals(defaultContact.Phone, departmentPhone, StringComparison.Ordinal))
        {
            if (defaultContact != null)
            {
                await client
                    .ActorContactDeleteAsync(actorId, defaultContact.ContactId)
                    .ConfigureAwait(false);
            }

            var newDefaultContact = new CreateActorContactDto
            {
                Name = departmentName,
                Email = departmentEmail,
                Phone = departmentPhone,
                Category = ContactCategory.Default,
            };

            await client
                .ActorContactPostAsync(actorId, newDefaultContact)
                .ConfigureAwait(false);
        }

        return true;
    }

    public Task<CalculationDto> CreateCalculationAsync(
        Interval period,
        string[] gridAreaCodes,
        WholesaleCalculationType calculationType,
        [Service] IWholesaleClient_V3 client)
    {
        if (!period.HasEnd || !period.HasStart)
        {
            throw new Exception("Period cannot be open-ended");
        }

        var calculationRequestDto = new CalculationRequestDto
        {
            StartDate = period.Start.ToDateTimeOffset(),
            EndDate = period.End.ToDateTimeOffset(),
            GridAreaCodes = gridAreaCodes,
            CalculationType = calculationType,
        };

        return client
            .CreateCalculationAsync(calculationRequestDto)
            .Then(calculationId => new CalculationDto
            {
                CalculationId = calculationId,
                ExecutionState = CalculationState.Pending,
                PeriodStart = calculationRequestDto.StartDate,
                PeriodEnd = calculationRequestDto.EndDate,
                ExecutionTimeEnd = null,
                ExecutionTimeStart = null,
                AreSettlementReportsCreated = false,
                GridAreaCodes = gridAreaCodes,
                CalculationType = calculationType,
            });
    }

    public async Task<bool> CreateAggregatedMeasureDataRequestAsync(
        EdiB2CWebAppProcessType processType,
        MeteringPointType? meteringPointType,
        string startDate,
        string? endDate,
        string? gridArea,
        string? energySupplierId,
        string? balanceResponsibleId,
        CancellationToken cancellationToken,
        [Service] IEdiB2CWebAppClient_V1 client)
    {
        await client.RequestAggregatedMeasureDataAsync(
            new RequestAggregatedMeasureDataMarketRequest()
            {
                ProcessType = processType,
                MeteringPointType = meteringPointType,
                StartDate = startDate,
                EndDate = endDate,
                GridArea = gridArea,
                EnergySupplierId = energySupplierId,
                BalanceResponsibleId = balanceResponsibleId,
            },
            cancellationToken)
            .ConfigureAwait(false);
        return true;
    }

    [Error(typeof(Clients.MarketParticipant.v1.ApiException))]
    public async Task<bool> UpdateOrganizationAsync(
        Guid orgId,
        string domain,
        [Service] IMarketParticipantClient_V1 client)
    {
        var organization = await client.OrganizationGetAsync(orgId).ConfigureAwait(false);
        if (!string.Equals(organization.Domain, domain, StringComparison.Ordinal))
        {
            var changes = new ChangeOrganizationDto()
            {
                Name = organization.Name,
                Domain = domain,
                Status = organization.Status,
            };

            await client.OrganizationPutAsync(orgId, changes).ConfigureAwait(false);
        }

        return true;
    }

    [Error(typeof(Clients.MarketParticipant.v1.ApiException))]
    public async Task<bool> CreateMarketParticipantAsync(
            CreateMarketParticipantInput input,
            [Service] IMarketParticipantClient_V1 client)
    {
        var organizationId =
            input.OrganizationId ??
            await client.OrganizationPostAsync(input.Organization!).ConfigureAwait(false);

        input.Actor.OrganizationId = organizationId;

        var actorId = await client
            .ActorPostAsync(input.Actor)
            .ConfigureAwait(false);

        await client
            .ActorContactPostAsync(actorId, input.ActorContact)
            .ConfigureAwait(false);

        return true;
    }

    [Error(typeof(Clients.MarketParticipant.v1.ApiException))]
    public async Task<bool> UpdateUserProfileAsync(
           UserProfileUpdateDto userProfileUpdateDto,
           [Service] IMarketParticipantClient_V1 client)
    {
        await client.UserUserprofilePutAsync(userProfileUpdateDto).ConfigureAwait(false);
        return true;
    }

    public async Task<bool> ResendWaitingEsettExchangeMessagesAsync([Service] IESettExchangeClient_V1 client)
    {
        await client.ResendMessagesWithoutResponseAsync();
        return true;
    }

    [Error(typeof(Clients.MarketParticipant.v1.ApiException))]
    public async Task<bool> CreateDelegationsForActorAsync(
        Guid actorId,
        CreateMessageDelegationDto delegationDto,
        [Service] IMarketParticipantClient_V1 client)
    {
        await client.ActorDelegationPostAsync(delegationDto);
        return true;
    }
}
