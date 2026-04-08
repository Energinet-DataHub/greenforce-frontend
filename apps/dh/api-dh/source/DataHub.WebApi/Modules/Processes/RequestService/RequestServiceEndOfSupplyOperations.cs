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
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestService.V1.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestService.V1.Models;
using HotChocolate.Authorization;
using EicFunction = Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1.EicFunction;

namespace Energinet.DataHub.WebApi.Modules.Processes.RequestService;

public static class RequestServiceEndOfSupplyOperations
{
    [Mutation]
    [Authorize(Policy = nameof(EicFunction.EnergySupplier))]
    [Authorize(Policy = nameof(EicFunction.GridAccessProvider))]
    public static async Task<bool> RequestServiceEndOfSupplyAsync(
        string meteringPointId,
        Guid processId,
        ServiceKindV1 serviceKind,
        DateTimeOffset startDate,
        string? description,
        IB2CClient ediB2CClient,
        CancellationToken ct)
    {
        var command = new RequestServiceCommandV1(
            new RequestServiceV1(
                MeteringPointId: meteringPointId,
                BusinessReason: BusinessReasonV1.EndOfSupply,
                ProcessReference: processId,
                StartDate: startDate,
                ServiceKind: serviceKind,
                Description: description ?? string.Empty));

        var result = await ediB2CClient.SendAsync(command, ct);

        return result.IsSuccess
            ? true
            : throw new GraphQLException("Command RequestServiceEndOfSupply failed");
    }
}
