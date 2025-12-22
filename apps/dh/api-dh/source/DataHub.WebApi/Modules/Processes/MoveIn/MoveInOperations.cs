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
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeCustomerCharacteristics.V1.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeCustomerCharacteristics.V1.Models;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfSupplier.V1.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfSupplier.V1.Models;
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.Processes.MoveIn;

public static class MoveInOperations
{
    [Mutation]
    [Authorize(Roles = new[] { "metering-point:move-in" })]
    public static async Task<bool> InitiateMoveInAsync(
        string meteringPointId,
        ChangeOfSupplierBusinessReason businessReason,
        DateTimeOffset startDate,
        CustomerIdentificationInput customerIdentification,
        string customerName,
        CancellationToken ct,
        [Service] IB2CClient ediB2CClient)
    {
        CustomerIdentification customerIdentificationObject = customerIdentification.Type?.ToLowerInvariant() switch
        {
            "cpr" => new CprIdentification(customerIdentification.Id ?? string.Empty),
            "cvr" => new CvrIdentification(customerIdentification.Id ?? string.Empty),
            _ => throw new ArgumentException($"Unknown customer identification type: {customerIdentification.Type}"),
        };

        var customerIdentificationV1 = new CustomerIdentificationV1(customerIdentificationObject);

        // Map to external enum
        var externalBusinessReason = businessReason switch
        {
            ChangeOfSupplierBusinessReason.CustomerMoveIn => Energinet.DataHub.EDI.B2CClient.Abstractions
                .RequestChangeOfSupplier.V1.Models.BusinessReasonV1.CustomerMoveIn,
            ChangeOfSupplierBusinessReason.SecondaryMoveIn => Energinet.DataHub.EDI.B2CClient.Abstractions
                .RequestChangeOfSupplier.V1.Models.BusinessReasonV1.SecondaryMoveIn,
            ChangeOfSupplierBusinessReason.ChangeOfEnergySupplier => Energinet.DataHub.EDI.B2CClient.Abstractions
                .RequestChangeOfSupplier.V1.Models.BusinessReasonV1.ChangeOfEnergySupplier,
            _ => throw new ArgumentOutOfRangeException(nameof(businessReason)),
        };

        var command = new RequestChangeOfSupplierCommandV1(new RequestChangeOfSupplierRequestV1(
            meteringPointId,
            externalBusinessReason,
            startDate,
            customerIdentificationV1,
            customerName));

        var result = await ediB2CClient.SendAsync(command, ct).ConfigureAwait(false);

        return result.IsSuccess;
    }

    [Mutation]
    [Authorize(Roles = new[] { "metering-point:move-in" })]
    public static async Task<bool> ChangeCustomerCharacteristicsAsync(
        string meteringPointId,
        ChangeCustomerCharacteristicsBusinessReason businessReason,
        CustomerInfoV1 firstCustomer,
        CustomerInfoV1? secondCustomer,
        bool electricalHeating,
        IReadOnlyCollection<UsagePointLocationV1>? usagePointLocations,
        CancellationToken ct,
        [Service] IB2CClient ediB2CClient)
    {
        // Map to external enum
        var externalBusinessReason = businessReason switch
        {
            ChangeCustomerCharacteristicsBusinessReason.ElectricHeating => Energinet.DataHub.EDI.B2CClient.Abstractions
                .RequestChangeCustomerCharacteristics.V1.Models.BusinessReasonV1.ElectricHeating,
            ChangeCustomerCharacteristicsBusinessReason.SecondaryMoveIn => Energinet.DataHub.EDI.B2CClient.Abstractions
                .RequestChangeCustomerCharacteristics.V1.Models.BusinessReasonV1.SecondaryMoveIn,
            ChangeCustomerCharacteristicsBusinessReason.ChangeOfEnergySupplier => Energinet.DataHub.EDI.B2CClient.Abstractions
                .RequestChangeCustomerCharacteristics.V1.Models.BusinessReasonV1.ChangeOfEnergySupplier,
            ChangeCustomerCharacteristicsBusinessReason.UpdateMasterDataConsumer => Energinet.DataHub.EDI.B2CClient.Abstractions
                .RequestChangeCustomerCharacteristics.V1.Models.BusinessReasonV1.UpdateMasterDataConsumer,
            ChangeCustomerCharacteristicsBusinessReason.CustomerMoveIn => Energinet.DataHub.EDI.B2CClient.Abstractions
                .RequestChangeCustomerCharacteristics.V1.Models.BusinessReasonV1.CustomerMoveIn,
            _ => throw new ArgumentOutOfRangeException(nameof(businessReason)),
        };

        var command = new RequestChangeCustomerCharacteristicsCommandV1(
            new RequestChangeCustomerCharacteristicsRequestV1(
                meteringPointId,
                externalBusinessReason,
                firstCustomer,
                secondCustomer,
                electricalHeating,
                usagePointLocations));

        var result = await ediB2CClient.SendAsync(command, ct).ConfigureAwait(false);

        return result.IsSuccess;
    }
}
