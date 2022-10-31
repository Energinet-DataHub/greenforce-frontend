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
using Energinet.DataHub.Core.App.Common.Abstractions.Identity;
using Energinet.DataHub.Core.App.Common.Abstractions.Security;
using Energinet.DataHub.Core.App.Common.Identity;
using Energinet.DataHub.Core.App.Common.Security;
using Energinet.DataHub.Core.App.WebApp.Middleware;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace Energinet.DataHub.WebApi.Registration
{
    public static class JwtTokenSecurityRegistrationExtensions
    {
        public static IServiceCollection AddJwtTokenSecurity(this IServiceCollection services, string metadataAddress, string audience)
        {
            services.AddSingleton<ISecurityTokenValidator, JwtSecurityTokenHandler>();
            services.AddSingleton<IConfigurationManager<OpenIdConnectConfiguration>>(_ =>
                new ConfigurationManager<OpenIdConnectConfiguration>(
                    metadataAddress,
                    new OpenIdConnectConfigurationRetriever()));

            services.AddScoped<IJwtTokenValidator>(sp =>
                new JwtTokenValidator(
                    sp.GetRequiredService<ILogger<JwtTokenValidator>>(),
                    sp.GetRequiredService<ISecurityTokenValidator>(),
                    sp.GetRequiredService<IConfigurationManager<OpenIdConnectConfiguration>>(),
                    audience));

            services.AddScoped<ClaimsPrincipalContext>();
            services.AddScoped<IClaimsPrincipalAccessor, ClaimsPrincipalAccessor>();

            services.AddScoped<JwtTokenMiddleware>();

            return services;
        }
    }
}
