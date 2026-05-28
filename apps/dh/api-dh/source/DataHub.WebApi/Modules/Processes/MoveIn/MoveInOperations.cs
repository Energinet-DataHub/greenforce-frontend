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

using Energinet.DataHub.EDI.B2CClient;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeCustomerCharacteristics.V2.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeCustomerCharacteristics.V2.Models;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfSupplier.V1.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfSupplier.V1.Models;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestIncorrectMoveIn.V1.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestIncorrectMoveIn.V1.Models;
using Energinet.DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetContactCpr.V1;
using Energinet.DataHub.ElectricityMarket.Abstractions.Features.MeteringPoint.GetMeteringPoint.V2;
using Energinet.DataHub.ElectricityMarket.Client;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Extensions;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Mappers;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Models;
using Energinet.DataHub.WebApi.Modules.Processes.MoveIn.Client;
using Energinet.DataHub.WebApi.Modules.RevisionLog.Attributes;
using HotChocolate.Authorization;
using NodaTime;
using ChangeCustomerCharacteristicsBusinessReason = Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeCustomerCharacteristics.V2.Models.BusinessReasonV2;
using ChangeOfSupplierBusinessReason = Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfSupplier.V1.Models.BusinessReasonV1;
using EicFunctionAuth = Energinet.DataHub.MarketParticipant.Authorization.Model.EicFunction;

namespace Energinet.DataHub.WebApi.Modules.Processes.MoveIn;

public static class MoveInOperations
{
    [Mutation]
    [Authorize(Roles = ["metering-point:move-in"])]
    [UseRevisionLog]
    public static async Task<bool> InitiateMoveInAsync(
        string meteringPointId,
        ChangeOfSupplierBusinessReason businessReason,
        DateTimeOffset startDate,
        CustomerIdentificationInput customerIdentification,
        string customerName,
        string energySupplier,
        CancellationToken ct,
        [Service] IB2CClient ediB2CClient)
    {
        CustomerIdentification customerIdentificationObject = customerIdentification.Type?.ToLowerInvariant() switch
        {
            "cpr" => new CprIdentification(customerIdentification.Id ?? string.Empty),
            "cvr" => new CvrIdentification(customerIdentification.Id ?? string.Empty),
            _ => throw new ArgumentException(message: $"Unknown customer identification type: {customerIdentification.Type}"),
        };

        var customerIdentificationV1 = new CustomerIdentificationV1(CvrOrCpr: customerIdentificationObject);
        var command = new RequestChangeOfSupplierCommandV1(RequestChangeOfSupplierRequest: new RequestChangeOfSupplierRequestV1(
            MeteringPointId: meteringPointId,
            BusinessReason: businessReason,
            StartDate: startDate,
            CustomerIdentification: customerIdentificationV1,
            EnergySupplier: energySupplier,
            CustomerName: customerName));

        var result = await ediB2CClient.SendAsync(command, ct).ConfigureAwait(false);

        if (!result.IsSuccess)
        {
            throw new GraphQLException(
                $"Command InitiateMoveIn failed for metering point '{meteringPointId}'. EDI response: {result}");
        }

        return true;
    }

    [Mutation]
    [Authorize(Roles = ["metering-point:move-in"])]
    [UseRevisionLog]
    public static async Task<bool> ChangeCustomerCharacteristicsAsync(
        string meteringPointId,
        ChangeCustomerCharacteristicsBusinessReason businessReason,
        string? firstCustomerCpr,
        string? firstCustomerCvr,
        string? firstCustomerName,
        string? secondCustomerCpr,
        string? secondCustomerName,
        string? processId,
        bool? protectedName,
        bool electricalHeating,
        IReadOnlyCollection<UsagePointLocationV2>? usagePointLocations,
        CancellationToken ct,
        [Service] IB2CClient ediB2CClient,
        [Service] IMoveInClient moveInClient,
        [Service] IElectricityMarketClient electricityMarketClient,
        [Service] IHttpContextAccessor httpContextAccessor)
    {
        var resolvedStartDate = GetDefaultResolvedStartDate();
        if (processId != null)
        {
            var startDate = await moveInClient.GetStartDateAsync(processId, ct).ConfigureAwait(false);
            if (startDate is null)
            {
                throw new GraphQLException($"Unable to resolve start date for process '{processId}'.");
            }

            resolvedStartDate = startDate.Value;
        }

        // When CPR is not provided for a private customer (no CVR), fetch the current CPR
        // from the metering point's existing customer data so that the update does not
        // accidentally clear the existing value.
        var resolvedFirstCustomerCpr = firstCustomerCpr;
        var resolvedSecondCustomerCpr = secondCustomerCpr;

        var isPrivateCustomer = string.IsNullOrEmpty(firstCustomerCvr);
        var needsFirstCpr = isPrivateCustomer && string.IsNullOrEmpty(resolvedFirstCustomerCpr);
        var needsSecondCpr = isPrivateCustomer && string.IsNullOrEmpty(resolvedSecondCustomerCpr) && !string.IsNullOrEmpty(secondCustomerName);

        if (needsFirstCpr || needsSecondCpr)
        {
            var contacts = await GetCustomerContactsAsync(meteringPointId, httpContextAccessor, electricityMarketClient, ct).ConfigureAwait(false);

            if (needsFirstCpr && contacts.JuridicalContactId is not null)
            {
                resolvedFirstCustomerCpr = await FetchContactCprAsync(meteringPointId, contacts.JuridicalContactId.Value, electricityMarketClient, ct).ConfigureAwait(false);
            }

            if (needsSecondCpr && contacts.SecondaryContactId is not null)
            {
                resolvedSecondCustomerCpr = await FetchContactCprAsync(meteringPointId, contacts.SecondaryContactId.Value, electricityMarketClient, ct).ConfigureAwait(false);
            }
        }

        var command = new RequestChangeCustomerCharacteristicsCommandV2(
            RequestChangeCustomerCharacteristicsRequest: new RequestChangeCustomerCharacteristicsRequestV2(
                MeteringPointId: meteringPointId,
                BusinessReason: businessReason,
                StartDate: resolvedStartDate,
                FirstCustomerCpr: resolvedFirstCustomerCpr,
                FirstCustomerCvr: firstCustomerCvr,
                FirstCustomerName: firstCustomerName,
                SecondCustomerCpr: resolvedSecondCustomerCpr,
                SecondCustomerName: secondCustomerName,
                ProtectedName: protectedName,
                ElectricalHeating: electricalHeating,
                ProcessId: processId,
                UsagePointLocations: usagePointLocations));

        var result = await ediB2CClient.SendAsync(command, ct).ConfigureAwait(false);

        if (!result.IsSuccess)
        {
            throw new GraphQLException(
                $"Command ChangeCustomerCharacteristics failed for metering point '{meteringPointId}'. EDI response: {result}");
        }

        return true;
    }

    [Mutation]
    [Authorize(Roles = ["metering-point:move-in"])]
    [UseRevisionLog]
    public static async Task<bool> RequestIncorrectMoveInAsync(
        Guid processId,
        string meteringPointId,
        DateTimeOffset cutoffDate,
        [Service] IB2CClient ediB2CClient,
        CancellationToken ct)
    {
        var command = new RequestIncorrectMoveInCommandV1(
            new RequestIncorrectMoveInRequestV1(processId.ToString(), meteringPointId, cutoffDate, "some-reason"));

        var result = await ediB2CClient.SendAsync(command, ct).ConfigureAwait(false);

        if (!result.IsSuccess)
        {
            throw new GraphQLException(
                $"Command RequestIncorrectMoveInAsync failed for metering point '{meteringPointId}'. EDI response: {result}");
        }

        return true;
    }

    private static async Task<(Guid? JuridicalContactId, Guid? SecondaryContactId)> GetCustomerContactsAsync(
        string meteringPointId,
        IHttpContextAccessor httpContextAccessor,
        IElectricityMarketClient electricityMarketClient,
        CancellationToken ct)
    {
        var user = httpContextAccessor.HttpContext?.User
            ?? throw new InvalidOperationException("Http context is not available.");

        var actorNumber = user.GetMarketParticipantNumber();
        var marketRole = Enum.Parse<EicFunctionAuth>(user.GetMarketParticipantMarketRole());

        var meteringPointResult = await electricityMarketClient
            .SendAsync(new GetMeteringPointQueryV2(meteringPointId, actorNumber, marketRole.MapToDto()), ct)
            .ConfigureAwait(false);

        var meteringPoint = meteringPointResult.Data?.MeteringPoint;
        if (meteringPoint is null)
        {
            return (null, null);
        }

        var customers = meteringPoint.CommercialRelation?.ActiveEnergySupplierPeriod?.Contacts;
        if (customers is null)
        {
            return (null, null);
        }

        Guid? juridicalId = null;
        Guid? secondaryId = null;

        foreach (var contact in customers)
        {
            if (contact.RelationType.MapToDto() == CustomerRelationType.Juridical)
            {
                juridicalId = contact.Id;
            }
            else if (contact.RelationType.MapToDto() == CustomerRelationType.Secondary)
            {
                secondaryId = contact.Id;
            }
        }

        return (juridicalId, secondaryId);
    }

    private static async Task<string?> FetchContactCprAsync(
        string meteringPointId,
        Guid contactId,
        IElectricityMarketClient electricityMarketClient,
        CancellationToken ct)
    {
        var result = await electricityMarketClient
            .SendAsync(new GetContactCprQueryV1(meteringPointId, contactId), ct)
            .ConfigureAwait(false);

        if (result.IsSuccess && result.HasData && result.Data is not null)
        {
            return result.Data.Cpr;
        }

        return null;
    }

    private static DateTimeOffset GetDefaultResolvedStartDate() =>
        SystemClock.Instance.GetCurrentInstant()
            .InZone(LocalDateExtensions.DanishTimeZone)
            .Date
            .ToUtcDateTimeOffset();
}
