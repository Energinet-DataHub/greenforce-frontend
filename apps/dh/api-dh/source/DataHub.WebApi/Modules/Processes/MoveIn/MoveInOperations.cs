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
using Energinet.DataHub.WebApi.Modules.Processes.MoveIn.Models;
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.Processes.MoveIn;

public static class MoveInOperations
{
    [Mutation]
    [Authorize(Roles = new[] { "metering-point:move-in" })]
    public static async Task<bool> InitiateMoveInAsync(
        InitiateMoveInInput input,
        CancellationToken ct,
        [Service] IB2CClient ediB2CClient)
    {
        var command = new RequestChangeOfSupplierCommandV1(
            new RequestChangeOfSupplierRequestV1(
                input.MeteringPointId,
                input.BusinessReason,
                input.StartDate,
                input.CustomerCprOrCvr,
                input.CustomerName));

        var result = await ediB2CClient.SendAsync(command, ct).ConfigureAwait(false);

        return result.IsSuccess;
    }
}
