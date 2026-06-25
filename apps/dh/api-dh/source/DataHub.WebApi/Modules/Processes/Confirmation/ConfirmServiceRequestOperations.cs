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
using Energinet.DataHub.EDI.B2CClient.Abstractions.ConfirmRequestService.V1.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.ConfirmRequestService.V1.Models;
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.Processes.Confirmation;

public static class ConfirmServiceRequestOperations
{
    [Mutation]
    [Authorize(Roles = ["metering-point:service-request-respond"])]
    public static async Task<bool> ConfirmServiceRequestAsync(
        string meteringPointId,
        Guid processId,
        string? description,
        IB2CClient ediB2CClient,
        CancellationToken ct)
    {
        var command = new ConfirmRequestServiceCommandV1(
            new ConfirmRequestServiceV1(
                MeteringPointId: meteringPointId,
                BusinessReason: BusinessReasonV1.RequestService,
                ProcessReference: processId,
                OriginalTransactionId: processId.ToString(),
                Description: description));

        var result = await ediB2CClient.SendAsync(command, ct);

        return result.IsSuccess
            ? true
            : throw new GraphQLException("Command ConfirmServiceRequest failed");
    }
}
