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

namespace Energinet.DataHub.WebApi.Common;

/// <summary>
/// Context of the current http context
/// </summary>
public interface ICommonExecutionContext
{
    /// <summary>
    /// Gets the userId of the current caller
    /// </summary>
    Guid UserId { get; }

    /// <summary>
    /// Gets the MarketParticipantNumber for the current caller
    /// </summary>
    Guid MarketParticipantNumber { get; }

    /// <summary>
    /// Get the market role for the current user as a enum type useable for authentication
    /// </summary>
    MarketRoles MarketRoleForAuth { get; }

    /// <summary>
    /// Get the market role for the current calling user
    /// </summary>
    EicFunction MarketRole { get; }
}
