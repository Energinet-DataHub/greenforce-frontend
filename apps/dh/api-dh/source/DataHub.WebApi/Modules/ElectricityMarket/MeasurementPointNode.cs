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

using Energinet.DataHub.Measurements.Abstractions.Api.Models;
using Energinet.DataHub.Measurements.Abstractions.Api.Queries;
using Energinet.DataHub.Measurements.Client;
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket;

[ObjectType<MeasurementPoint>]
public static partial class MeasurementPointNode
{
    [Query]
    [UsePaging]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeasurementPoint>> GetMeasurementsAsync(
        GetMeasurementsForDayQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client) =>
            await client.GetMeasurementsForDayAsync(query, ct).ConfigureAwait(false);
}
