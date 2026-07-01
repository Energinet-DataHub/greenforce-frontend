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
using Energinet.DataHub.MarketParticipant.Authorizations.Client;
using Energinet.DataHub.WebApi.Extensions;

namespace Energinet.DataHub.WebApi.Common;

internal sealed class CommonExecutionContext(
    IHttpContextAccessor contextAccessor) : ICommonExecutionContext
{
    public Guid UserId
    {
        get
        {
            var userId = contextAccessor.HttpContext?.User.GetUserId();
            return userId is null
                ? throw new UnauthorizedAccessException("No userId found")
                : userId.Value;
        }
    }

    public Guid MarketParticipantNumber
    {
        get
        {
            var marketParticipantNumber = contextAccessor.HttpContext?.User.GetMarketParticipantNumber();
            return string.IsNullOrEmpty(marketParticipantNumber)
                ? throw new UnauthorizedAccessException("No marketParticipantNumber found")
                : Guid.Parse(marketParticipantNumber);
        }
    }

    public EicFunction MarketRole
    {
        get
        {
            var marketRoleString = contextAccessor.HttpContext?.User.GetMarketParticipantMarketRole();
            if (string.IsNullOrEmpty(marketRoleString))
                throw new UnauthorizedAccessException("No marketRole found");

            return Enum.TryParse<EicFunction>(marketRoleString, ignoreCase: true, out var marketRole)
                ? marketRole
                : throw new UnauthorizedAccessException($"Unsupported marketRole '{marketRoleString}'");
        }
    }

    public MarketRoles MarketRoleForAuth
    {
        get
        {
            return MarketRole.ToMarkParAuthRole();
        }
    }
}
