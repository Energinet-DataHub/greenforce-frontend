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
using NodaTime;
using NodaTime.Extensions;

namespace Energinet.DataHub.WebApi.Modules.Charges.Models;

public record ChargePeriod(ChargeInformationPeriodDto PeriodDto)
{
    public string Name => PeriodDto.Name;

    public string Description => PeriodDto.Description;

    public bool VatInclusive => PeriodDto.VatClassificationDto == VatClassificationDto.Vat25;

    public bool TransparentInvoicing => PeriodDto.TransparentInvoicing;

    public bool PredictablePrice => false; // TODO: Implement once available in backend

    public Interval Period => new(
        PeriodDto.StartDate,
        PeriodDto.EndDate?.ToDateTimeOffset().Year == DateTimeOffset.MaxValue.Year ? null : PeriodDto.EndDate);

    public ChargeStatus Status => DateTimeOffset.Now.ToInstant() switch
    {
        _ when PeriodDto.StartDate == PeriodDto.EndDate => ChargeStatus.Cancelled,
        var now when now > PeriodDto.EndDate => ChargeStatus.Closed,
        var now when now < PeriodDto.StartDate => ChargeStatus.Awaiting,
        _ => ChargeStatus.Current,
    };
}
