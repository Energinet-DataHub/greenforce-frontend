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
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Energinet.DataHub.WebApi.Tests.ServiceMocks
{
    public sealed class JwtAuthenticationServiceMock : IServiceMock
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddAuthentication(options =>
                {
                    // Remove existing registrations, so a mocked token can be accepted.
                    options.SchemeMap.Clear();

                    var schemas = (ICollection<AuthenticationSchemeBuilder>)options.Schemes;
                    schemas.Clear();
                });

            services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateAudience = false,
                        ValidateIssuer = false,
                        ValidateIssuerSigningKey = false,
                        ValidateLifetime = false,
                        RequireExpirationTime = false,
                        RequireSignedTokens = false,
                        SignatureValidator = (token, _) => new JwtSecurityToken(token),
                    };
                });
        }

        public static void AddAuthorizationHeader(HttpClient client, Guid actorId, params Claim[] claims)
        {
            var azpClaim = new Claim("azp", actorId.ToString());
            var jwtToken = new JwtSecurityToken(
                "issuer",
                "audience",
                claims.Prepend(azpClaim));

            var tokenHandler = new JwtSecurityTokenHandler();
            var finalToken = tokenHandler.WriteToken(jwtToken);

            const string authHeaderName = "Authorization";
            client.DefaultRequestHeaders.Remove(authHeaderName);
            client.DefaultRequestHeaders.Add(authHeaderName, $"Bearer {finalToken}");
        }
    }
}
