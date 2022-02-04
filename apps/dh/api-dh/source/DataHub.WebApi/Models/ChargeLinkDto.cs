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

using System;
using Energinet.Charges.Contracts.Charge;

namespace Energinet.DataHub.WebApi.Models
{
    /// <summary>
    /// Represents a Charge Link
    /// </summary>
    /// <param name="ChargeType">The type of charge; tariff, fee or subscription</param>
    /// <param name="ChargeId">A charge identifier provided by the market participant. Combined with charge owner and charge type it becomes unique</param>
    /// <param name="ChargeName">Charge name provided by the market participant.</param>
    /// <param name="ChargeOwnerIdentificationNumber">A charge owner identification, e.g. the market participant's GLN or EIC number</param>
    /// <param name="ChargeOwnerName">The market participant's company name</param>
    /// <param name="TaxIndicator">Indicates whether a tariff is considered a tax or not</param>
    /// <param name="TransparentInvoicing">Indicates whether the charge owner wants the charge to be displayed on the customer invoice</param>
    /// <param name="Quantity">The charge link's quantity</param>
    /// <param name="StartDate">The charge link's start date time in UTC</param>
    /// <param name="EndDate">The charge link's end date time in UTC</param>
    public record ChargeLinkDto(
        ChargeType ChargeType,
        string ChargeId,
        string ChargeName,
        string ChargeOwnerIdentificationNumber,
        string ChargeOwnerName,
        bool TaxIndicator,
        bool TransparentInvoicing,
        int Quantity,
        DateTimeOffset StartDate,
        DateTimeOffset? EndDate);
}
