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

using System.Text.Json;
using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Models;
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint;

public static class ElectricityMarketDebug
{
    [Query]
    [Authorize(Roles = ["metering-point:search"])]
    public static async Task<string> GetDebugViewAsync(
       string meteringPointId,
       CancellationToken ct,
       [Service] IElectricityMarketClient_V1 electricityMarketClient) =>
            (await electricityMarketClient.MeteringPointDebugViewAsync(meteringPointId, ct).ConfigureAwait(false)).Result;

    [Query]
    [Authorize(Roles = ["metering-point:search"])]
    public static async Task<IEnumerable<MeteringPointsGroupByPackageNumber>> GetMeteringPointsByGridAreaCodeAsync(
        string gridAreaCode,
        CancellationToken ct,
        [Service] IElectricityMarketClient_V1 electricityMarketClient)
    {
        var response = await electricityMarketClient.MeteringPointDebugAsync(gridAreaCode, ct).ConfigureAwait(false);

        var grouped = response.GroupBy(x => x.Identification.Substring(10, 4));

        return grouped.Select(x => new MeteringPointsGroupByPackageNumber(x.Key, x)).OrderBy(x => x.PackageNumber);
    }

    [Query]
    [Authorize(Roles = ["metering-point:search"])]
    public static async Task<GetMeteringPointResultDtoV1> GetDebugViewV2Async(
        string meteringPointId,
        CancellationToken ct,
        [Service] IElectricityMarketClient_V1 electricityMarketClient)
    {
        await Task.CompletedTask.ConfigureAwait(false);

        return new GetMeteringPointResultDtoV1(
            new MeteringPointDtoV1(
                "1234567890123456",
                [],
                []),
            [
                new GetMeteringPointResultDtoV1.EventDto(
                    Guid.NewGuid(),
                    DateTimeOffset.UtcNow.AddHours(-3).AddMinutes(-45),
                    "SampleEvent1",
                    JsonSerializer.Serialize(new { Id = "a", Value = 111, })),
                new GetMeteringPointResultDtoV1.EventDto(
                    Guid.NewGuid(),
                    DateTimeOffset.UtcNow,
                    "SampleEvent2",
                    JsonSerializer.Serialize(new { Id = "b", Value = 222, })),
            ]);
    }

    public record GetMeteringPointResultDtoV1(
        MeteringPointDtoV1 MeteringPoint,
        IReadOnlyCollection<GetMeteringPointResultDtoV1.EventDto> Events)
    {
        /// <summary>
        /// Represents an event in the event stream of a metering point.
        /// </summary>
        /// <param name="Id">The event id, given by the event store.</param>
        /// <param name="Timestamp">The timestamp of when the event was added to the event store.</param>
        /// <param name="Type">The type name of the event.</param>
        /// <param name="JsonData">The data for the event.</param>
        public record EventDto(
            Guid Id,
            DateTimeOffset Timestamp,
            string Type,
            string JsonData);
    }

    public record MeteringPointDtoV1(
        string MeteringPointId,
        IReadOnlyCollection<MeteringPointDtoV1.MeteringPointPeriodDto2> MeteringPointPeriods,
        IReadOnlyCollection<MeteringPointDtoV1.CommercialRelationDto2> CommercialRelations)
    {
        public record MeteringPointPeriodDto2(
            DateTimeOffset ValidFrom,
            DateTimeOffset ValidTo,
            MeteringPointType Type,
            ConnectionState ConnectionState);

        public record CommercialRelationDto2(
            DateTimeOffset StartDate,
            DateTimeOffset EndDate,
            string EnergySupplierId,
            Guid CustomerId,
            IReadOnlyCollection<EnergySupplierPeriodDto> EnergySupplierPeriods);

        public record EnergySupplierPeriodDto(
            DateTimeOffset ValidFrom,
            DateTimeOffset ValidTo,
            IReadOnlyCollection<ContactDto> Contacts);

        public record ContactDto(
            string Name,
            ContactAddressDto? Address);

        public record ContactAddressDto(
            string StreetName);
    }
}
