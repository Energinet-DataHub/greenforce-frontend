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
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Modules.RevisionLog.Attributes;
using HotChocolate.Authorization;
using ChangeOfSupplierBusinessReason = Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeOfSupplier.V1.Models.BusinessReasonV1;

namespace Energinet.DataHub.WebApi.Modules.Processes.ChangeOfSupplier;

public static class ChangeOfSupplierOperations
{
    [Mutation]
    [Authorize(Roles = ["metering-point:change-of-supplier"])]
    [UseRevisionLog]
    public static async Task<bool> InitiateChangeOfSupplierAsync(
        string meteringPointId,
        DateTimeOffset startDate,
        string customerType,
        string? cpr,
        string? cvr,
        CancellationToken ct,
        [Service] IB2CClient ediB2CClient,
        [Service] IHttpContextAccessor httpContextAccessor)
    {
        CustomerIdentification customerIdentificationObject = customerType.ToLowerInvariant() switch
        {
            "private" => new CprIdentification(cpr ?? string.Empty),
            "business" => new CvrIdentification(cvr ?? string.Empty),
            _ => throw new ArgumentException($"Unknown customer type: {customerType}"),
        };

        var customerIdentificationV1 = new CustomerIdentificationV1(CvrOrCpr: customerIdentificationObject);
        var energySupplier = httpContextAccessor.GetUserActorNumber();
        var command = new RequestChangeOfSupplierCommandV1(RequestChangeOfSupplierRequest: new RequestChangeOfSupplierRequestV1(
            MeteringPointId: meteringPointId,
            BusinessReason: ChangeOfSupplierBusinessReason.ChangeOfEnergySupplier,
            StartDate: startDate,
            CustomerIdentification: customerIdentificationV1,
            EnergySupplier: energySupplier,
            CustomerName: null));

        var result = await ediB2CClient.SendAsync(command, ct).ConfigureAwait(false);

        return result.IsSuccess;
    }
}
