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
namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Models;

public class InstallationAddressDto
{
    public required string Id { get; set; }

    public string? StreetCode { get; set; }

    public string StreetName { get; set; } = default!;

    public string BuildingNumber { get; set; } = default!;

    public string CityName { get; set; } = default!;

    public string? CitySubDivisionName { get; set; }

    public System.Guid? DarReference { get; set; }

    public WashInstructions? WashInstructions { get; set; }

    public string CountryCode { get; set; } = default!;

    public string? Floor { get; set; }

    public string? Room { get; set; }

    public string PostCode { get; set; } = default!;

    public string? MunicipalityCode { get; set; }

    public string? LocationDescription { get; set; }
}
