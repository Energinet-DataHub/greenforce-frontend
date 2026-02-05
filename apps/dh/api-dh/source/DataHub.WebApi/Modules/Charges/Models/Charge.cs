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

using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeInformation;
using Energinet.DataHub.Charges.Abstractions.Shared;
using Resolution = Energinet.DataHub.WebApi.Modules.Common.Models.Resolution;

namespace Energinet.DataHub.WebApi.Modules.Charges.Models;

public record Charge(
    ChargeIdentifierDto Id,
    Resolution Resolution,
    bool TaxIndicator,
    bool SpotDependingPrice,
    IReadOnlyCollection<ChargeInformationPeriodDto> PeriodDtos)
{
    public string Code => Id.Code;

    public ChargeType Type => ChargeType.Make(Id.TypeDto, TaxIndicator);

    public IEnumerable<ChargePeriod> Periods => PeriodDtos.Select(p => new ChargePeriod(p));

    public ChargePeriod LatestPeriod => Periods.First();

    public string Name => LatestPeriod.Name;

    public string Description => LatestPeriod.Description;

    public bool VatInclusive => LatestPeriod.VatInclusive;

    public bool TransparentInvoicing => LatestPeriod.TransparentInvoicing;

    public ChargeStatus Status => LatestPeriod.Status;

    public string FilterText => $"{Code} {Name} {Description}";
}
