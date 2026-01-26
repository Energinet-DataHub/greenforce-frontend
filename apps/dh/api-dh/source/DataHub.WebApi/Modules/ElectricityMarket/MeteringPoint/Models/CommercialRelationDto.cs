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

public class CommercialRelationDto
{
    public long Id { get; set; }

    public string EnergySupplier { get; set; } = default!;

    public DateTimeOffset StartDate { get; set; }

    public DateTimeOffset EndDate { get; set; }

    public EnergySupplyPeriodDto? ActiveEnergySupplyPeriod { get; set; }

    public ICollection<EnergySupplyPeriodDto> EnergySupplyPeriodTimeline { get; set; } = default!;

    public ElectricalHeatingDto? ActiveElectricalHeatingPeriods { get; set; }

    public ICollection<ElectricalHeatingDto> ElectricalHeatingPeriods { get; set; } = default!;
}
