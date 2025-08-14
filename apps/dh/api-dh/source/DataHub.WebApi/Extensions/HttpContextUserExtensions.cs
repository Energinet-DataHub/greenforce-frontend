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

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Energinet.DataHub.WebApi.Extensions;

public static class HttpContextUserExtensions
{
    private class ClaimNames
    {
        public const string ActorNumber = "actornumber";
        public const string MarketRole = "marketroles";
    }

    public static bool IsFas(this ClaimsPrincipal user)
    {
        return user.Claims.Any(c => c is { Type: "multitenancy", Value: "true" });
    }

    public static Guid GetAssociatedMarketParticipant(this ClaimsPrincipal user)
    {
        var azp = user.Claims.First(c => c is { Type: "azp" });
        return Guid.Parse(azp.Value);
    }

    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var claim = user.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub || c.Type == ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException($"Could not find claim that is expected to contain UserId.");

        return Guid.Parse(claim.Value);
    }

    public static bool HasRole(this ClaimsPrincipal user, string role)
    {
        return user.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == role);
    }

    public static string GetMarketParticipantNumber(this ClaimsPrincipal user)
    {
        return user.Claims.First(c => c is { Type: ClaimNames.ActorNumber }).Value;
    }

    public static string GetMarketParticipantMarketRole(this ClaimsPrincipal user)
    {
        return user.Claims.First(c => c is { Type: ClaimNames.MarketRole }).Value;
    }

    public static IReadOnlyCollection<string> GetPermissions(this ClaimsPrincipal user)
    {
        return user.Claims.Where(c => c is { Type: ClaimTypes.Role }).Select(x => x.Value).ToList();
    }

    public static void AddClaimsFromJwt(this ClaimsPrincipal user, string token)
    {
        foreach (var claim in new JwtSecurityTokenHandler().ReadJwtToken(token).Claims)
        {
            user.AddIdentity(new ClaimsIdentity(new[] { claim }));
        }
    }
}
