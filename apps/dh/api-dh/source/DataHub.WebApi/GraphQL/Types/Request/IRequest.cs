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

using Energinet.DataHub.ProcessManager.Abstractions.Api.Model;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;

namespace Energinet.DataHub.WebApi.GraphQL.Types.Request;

/// <summary>
/// Interface for request.
/// </summary>
public interface IRequest : IInputParameterDto
{
    /// <summary>
    /// The calculation type.
    /// </summary>
    CalculationType CalculationType { get; }

    /// <summary>
    /// The start date of the period.
    /// </summary>
    DateTimeOffset PeriodStart { get; }

    /// <summary>
    /// The end date of the period.
    /// </summary>
    DateTimeOffset PeriodEnd { get; }

    /// <summary>
    /// The grid area.
    /// </summary>
    string? GridArea { get; }

    /// <summary>
    /// The energy supplier.
    /// </summary>
    string? EnergySupplierId { get; }

    /// <summary>
    /// The parameter value.
    /// </summary>
    string DataTypeSortProperty { get; }
}
