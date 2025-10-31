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
using Energinet.DataHub.WebApi.Modules.Charges.Models;

namespace Energinet.DataHub.WebApi.Modules.Charges.Extensions;

public static class ChargeInformationDtoExtensions
{
    public static ChargeStatus GetStatus(this ChargeInformationDto charge) => charge switch
    {
        _ when charge.ValidFrom == charge.ValidTo => ChargeStatus.Cancelled,
        _ when charge.ValidTo < DateTimeOffset.Now => ChargeStatus.Closed,
        { HasAnyPrices: false } c when c.ValidFrom > DateTimeOffset.Now => ChargeStatus.Awaiting,
        { HasAnyPrices: false } c when c.ValidFrom < DateTimeOffset.Now => ChargeStatus.MissingPriceSeries,
        { HasAnyPrices: true } c when c.ValidFrom < DateTimeOffset.Now => ChargeStatus.Current,
        _ => ChargeStatus.Invalid,
    };
}
