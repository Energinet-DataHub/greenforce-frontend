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
using System.Threading.Tasks;
using GraphQL;
using GraphQL.Server.Transports.AspNetCore.WebSockets;
using GraphQL.Transport;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;

namespace Energinet.DataHub.WebApi
{
    public class JwtWebSocketAuthenticationService : IWebSocketAuthenticationService
    {
        private readonly IGraphQLSerializer _graphQLSerializer;
        private readonly IOptionsMonitor<JwtBearerOptions> _jwtBearerOptionsMonitor;

        public JwtWebSocketAuthenticationService(IGraphQLSerializer graphQLSerializer, IOptionsMonitor<JwtBearerOptions> jwtBearerOptionsMonitor)
        {
            _graphQLSerializer = graphQLSerializer;
            _jwtBearerOptionsMonitor = jwtBearerOptionsMonitor;
        }

        public Task AuthenticateAsync(IWebSocketConnection connection, string subProtocol, OperationMessage operationMessage)
        {
            try
            {
                // for connections authenticated via HTTP headers, no need to reauthenticate
                if (connection.HttpContext.User.Identity?.IsAuthenticated ?? false)
                {
                    return Task.CompletedTask;
                }

                // attempt to read the 'Authorization' key from the payload object and verify it contains "Bearer XXXXXXXX"
                var authPayload = _graphQLSerializer.ReadNode<AuthPayload>(operationMessage.Payload);
                if (authPayload != null && authPayload.Authorization != null && authPayload.Authorization.StartsWith("Bearer ", StringComparison.Ordinal))
                {
                    // pull the token from the value
                    var token = authPayload.Authorization[7..];
                    // parse the token in the same manner that the .NET AddJwtBearer() method does:
                    // JwtSecurityTokenHandler maps the 'name' and 'role' claims to the 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
                    // and 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' claims;
                    // this mapping is not performed by Microsoft.IdentityModel.JsonWebTokens.JsonWebTokenHandler
                    var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
                    var tokenValidationParameters = _jwtBearerOptionsMonitor.Get(JwtBearerDefaults.AuthenticationScheme).TokenValidationParameters;
                    #pragma warning disable VSTHRD103
                    var principal = handler.ValidateToken(token, tokenValidationParameters, out var securityToken);
                    #pragma warning restore VSTHRD103
                    // set the ClaimsPrincipal for the HttpContext; authentication will take place against this object
                    connection.HttpContext.User = principal;
                    // Add the Authorization header to the request
                    connection.HttpContext.Request.Headers.Add("Authorization", authPayload.Authorization);
                }
            }
            catch
            {
                // no errors during authentication should throw an exception
                // specifically, attempting to validate an invalid JWT token will result in an exception, which may be logged or simply ignored to not generate an inordinate amount of logs without purpose
            }

            return Task.CompletedTask;
        }

        private class AuthPayload
        {
            public string? Authorization { get; set; }
        }
    }
}
