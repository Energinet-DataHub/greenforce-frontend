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

using Energinet.DataHub.MarketParticipant.Authorizations.Client;

namespace Energinet.DataHub.WebApi.Common;

/// <summary>
/// Authorizer using marketParticipant
/// </summary>
public interface IAuthorizationsClient
{
    /// <summary>
    /// Used to obtain a authorization context used for a downstream system via HTTP headers
    /// </summary>
    /// <param name="gln"></param>
    /// <param name="marketRole"></param>
    /// <param name="body"></param>
    /// <param name="cancellationToken"></param>
    /// <returns>A <see cref="Task{TResult}"/> representing the result of the asynchronous operation.</returns>
    Task<string> AuthorizationTokenForActorAsync(
        string? gln,
        MarketRoles? marketRole,
        AuthorizationContextRequest body,
        CancellationToken cancellationToken);
}
