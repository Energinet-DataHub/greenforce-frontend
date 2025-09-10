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

namespace Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

/// <summary>
/// Represents a grid area.
/// </summary>
public interface IGridArea
{
    /// <summary>
    /// The grid area id.
    /// </summary>
    Guid Id { get; }

    /// <summary>
    /// The grid area code.
    /// </summary>
    string PriceAreaCode { get; }

    /// <summary>
    /// The grid area name.
    /// </summary>
    string Name { get; }

    /// <summary>
    /// The grid area code.
    /// </summary>
    string Code { get; }

    /// <summary>
    /// The grid area Validfrom.
    /// </summary>
    DateTimeOffset ValidFrom { get; }

    /// <summary>
    /// The grid area Validto.
    /// </summary>
    DateTimeOffset? ValidTo { get; }

    /// <summary>
    /// The grid area type.
    /// </summary>
    GridAreaType Type { get; }

    /// <summary>
    /// Indicates whether the grid area is to be discontinued.
    /// </summary>
    bool ToBeDiscontinued { get; }
}
