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

public class MeteringPointMetadataDto
{
    public required string Id { get; set; }

    public DateTimeOffset ValidFrom { get; set; }

    public DateTimeOffset ValidTo { get; set; }

    public string? ParentMeteringPoint { get; set; }

    public MeteringPointType Type { get; set; }

    public MeteringPointSubType? SubType { get; set; }

    public ConnectionState? ConnectionState { get; set; }

    public string Resolution { get; set; } = default!;

    public string GridAreaCode { get; set; } = default!;

    public string OwnedBy { get; set; } = default!;

    public ConnectionType? ConnectionType { get; set; }

    public DisconnectionType? DisconnectionType { get; set; }

    public Product? Product { get; set; }

    public bool? ProductObligation { get; set; }

    public MeteringPointMeasureUnit MeasureUnit { get; set; }

    public AssetType? AssetType { get; set; }

    public bool? EnvironmentalFriendly { get; set; }

    public string? Capacity { get; set; }

    public double? PowerLimitKw { get; set; }

    public int? PowerLimitAmp { get; set; }

    public string? MeterNumber { get; set; }

    public int? NetSettlementGroup { get; set; }

    public int? ScheduledMeterReadingMonth { get; set; }

    public AnnualDate? ScheduledMeterReadingDate { get; set; }

    public string? FromGridAreaCode { get; set; }

    public string? ToGridAreaCode { get; set; }

    public string? PowerPlantGsrn { get; set; }

    public SettlementMethod? SettlementMethod { get; set; }

    public InstallationAddressDto? InstallationAddress { get; set; }

    public bool ManuallyHandled { get; set; }
}
