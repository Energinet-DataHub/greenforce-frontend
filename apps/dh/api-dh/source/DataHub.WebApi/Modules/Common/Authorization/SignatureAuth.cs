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

using Energinet.DataHub.MarketParticipant.Authorization.Model;
using Energinet.DataHub.MarketParticipant.Authorization.Model.AccessValidationRequests;
using Energinet.DataHub.MarketParticipant.Authorization.Services;
using Energinet.DataHub.WebApi.Extensions;
using EicFunctionAuth = Energinet.DataHub.MarketParticipant.Authorization.Model.EicFunction;

namespace Energinet.DataHub.WebApi.Modules.Common.Authorization;

public static class SignatureAuth
{
    public static AccessValidationRequest GetAccessValidationRequest(Type accessValidationRequestType, string meteringPointId, IHttpContextAccessor httpContextAccessor, IRequestAuthorization requestAuthorization)
    {
        return GetAccessValidationRequestHelper(accessValidationRequestType, meteringPointId, default, default, httpContextAccessor, requestAuthorization);
    }

    public static AccessValidationRequest GetAccessValidationRequest(Type accessValidationRequestType, string meteringPointId, DateTimeOffset from, DateTimeOffset to, IHttpContextAccessor httpContextAccessor, IRequestAuthorization requestAuthorization)
    {
        return GetAccessValidationRequestHelper(accessValidationRequestType, meteringPointId, from, to, httpContextAccessor, requestAuthorization);
    }

    private static AccessValidationRequest GetAccessValidationRequestHelper(Type accessValidationRequestType, string meteringPointId, DateTimeOffset from, DateTimeOffset to, IHttpContextAccessor httpContextAccessor, IRequestAuthorization requestAuthorization)
    {
        if (httpContextAccessor.HttpContext == null)
        {
            throw new InvalidOperationException("Http context is not available.");
        }

        var user = httpContextAccessor.HttpContext.User;

        var actorNumber = user.GetActorNumber();
        var marketRole = Enum.Parse<EicFunctionAuth>(user.GetActorMarketRole());

        return accessValidationRequestType switch
        {
            Type t when t == typeof(MeteringPointMasterDataAccessValidationRequest) =>
                new MeteringPointMasterDataAccessValidationRequest
                {
                    MeteringPointId = meteringPointId,
                    ActorNumber = actorNumber,
                    MarketRole = marketRole,
                },
            Type t when t == typeof(MeasurementsAccessValidationRequest) =>
                new MeasurementsAccessValidationRequest
                {
                    MeteringPointId = meteringPointId,
                    ActorNumber = actorNumber,
                    MarketRole = marketRole,
                    RequestedPeriod = new AccessPeriod(meteringPointId, from, to),
                },
            _ => throw new ArgumentException("Unsupported access validation request type."),
        };
    }
}
