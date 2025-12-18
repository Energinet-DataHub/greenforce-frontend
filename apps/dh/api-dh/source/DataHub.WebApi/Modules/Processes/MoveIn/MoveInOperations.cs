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
        BusinessReasonV1 businessReason,
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

        var command = new RequestChangeOfSupplierCommandV1(new RequestChangeOfSupplierRequestV1(
            meteringPointId,
            businessReason,
            startDate,
            customerIdentificationV1,
            customerName));

        var result = await ediB2CClient.SendAsync(command, ct).ConfigureAwait(false);

        return result.IsSuccess;
    }
}
