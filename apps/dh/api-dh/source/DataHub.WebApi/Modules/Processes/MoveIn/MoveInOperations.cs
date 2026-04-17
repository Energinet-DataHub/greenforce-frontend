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
using Energinet.DataHub.WebApi.Modules.Processes.MoveIn.Client;
using Energinet.DataHub.WebApi.Modules.RevisionLog.Attributes;
using HotChocolate.Authorization;
using ChangeCustomerCharacteristicsBusinessReason = Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeCustomerCharacteristics.V2.Models.BusinessReasonV2;
using ChangeOfSupplierBusinessReason = Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfSupplier.V1.Models.BusinessReasonV1;

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

        return result.IsSuccess;
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
        [Service] IMoveInClient moveInClient)
    {
        var resolvedStartDate = DateTimeOffset.UtcNow;
        if (processId != null)
        {
            var startDate = await moveInClient.GetStartDateAsync(processId, ct).ConfigureAwait(false);
            if (startDate is null)
            {
                throw new HotChocolate.GraphQLException($"Unable to resolve start date for process '{processId}'.");
            }

            resolvedStartDate = startDate.Value;
        }

        var command = new RequestChangeCustomerCharacteristicsCommandV2(
            RequestChangeCustomerCharacteristicsRequest: new RequestChangeCustomerCharacteristicsRequestV2(
                MeteringPointId: meteringPointId,
                BusinessReason: businessReason,
                StartDate: resolvedStartDate,
                FirstCustomerCpr: firstCustomerCpr,
                FirstCustomerCvr: firstCustomerCvr,
                FirstCustomerName: firstCustomerName,
                SecondCustomerCpr: secondCustomerCpr,
                SecondCustomerName: secondCustomerName,
                ProtectedName: protectedName,
                ElectricalHeating: electricalHeating,
                ProcessId: processId,
                UsagePointLocations: usagePointLocations));

        var result = await ediB2CClient.SendAsync(command, ct).ConfigureAwait(false);

        return result.IsSuccess;
    }
}
