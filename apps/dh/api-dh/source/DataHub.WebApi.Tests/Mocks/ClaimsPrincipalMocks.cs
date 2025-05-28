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

using System;
using System.Security.Claims;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.Tests.Mocks;

public enum UserIdentity
{
    Administrator,
    Authenticated,
    Anonymous,
}

public static class ClaimsPrincipalMocks
{
    public static Guid ActorId { get; } = Guid.Parse("d16d03d7-03fa-473c-8ec0-644b2f90718b");

    public static ClaimsPrincipal CreateAdministrator() =>
        new ClaimsPrincipal(
            new ClaimsIdentity(
                new[]
                {
                    new Claim(ClaimTypes.Role, "calculations:view"),
                    new Claim(ClaimTypes.Role, "calculations:manage"),
                    new Claim(ClaimTypes.Role, "metering-point:search"),
                },
                "MockedAuthenticationType"));

    public static ClaimsPrincipal CreateAuthenticated() =>
        new ClaimsPrincipal(new ClaimsIdentity(null, "MockedAuthenticationType"));

    public static ClaimsPrincipal CreateAnonymous() =>
        new ClaimsPrincipal(new ClaimsIdentity());

    public static ClaimsPrincipal Create(UserIdentity userIdentity) =>
        userIdentity switch
        {
            UserIdentity.Administrator => CreateAdministrator(),
            UserIdentity.Authenticated => CreateAuthenticated(),
            UserIdentity.Anonymous => CreateAnonymous(),
        };

    public static ClaimsPrincipal CreateBalanceResponsibleParty() =>
        new ClaimsPrincipal(
            new ClaimsIdentity(
                new[]
                {
                    new("azp", ActorId.ToString()),
                    new Claim(ClaimTypes.Role, "request-aggregated-measured-data:view"),
                },
                "MockedAuthenticationType"));

    public static ClaimsPrincipal CreateEnergySupplier() =>
        new ClaimsPrincipal(
            new ClaimsIdentity(
                new[]
                {
                    new("azp", ActorId.ToString()),
                    new Claim(ClaimTypes.Role, "request-wholesale-settlement:view"),
                    new Claim(ClaimTypes.Role, "request-aggregated-measured-data:view"),
                },
                "MockedAuthenticationType"));

    public static ClaimsPrincipal CreateGridAccessProvider() =>
        new ClaimsPrincipal(
            new ClaimsIdentity(
                new[]
                {
                    new("azp", ActorId.ToString()),
                    new Claim(ClaimTypes.Role, "request-wholesale-settlement:view"),
                },
                "MockedAuthenticationType"));

    public static ClaimsPrincipal FromMarketRole(EicFunction eicFunction) =>
        eicFunction switch
        {
            EicFunction.BalanceResponsibleParty => CreateBalanceResponsibleParty(),
            EicFunction.EnergySupplier => CreateEnergySupplier(),
            EicFunction.GridAccessProvider => CreateGridAccessProvider(),
            _ => throw new NotImplementedException(),
        };
}
