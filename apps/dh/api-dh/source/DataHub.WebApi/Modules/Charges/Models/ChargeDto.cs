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

namespace Energinet.DataHub.WebApi.Modules.Charges.Models;

public record ChargeDto(
        Guid Id,
        ChargeType ChargeType,
        ChargeResolution Resolution,
        ChargeStatus Status,
        string ChargeId, // Is SenderProvidedChargeId.
        string ChargeName,
        string ChargeDescription,
        string ChargeOwner,
        string ChargeOwnerName,
        VatClassification VatClassification,
        bool TaxIndicator,
        bool TransparentInvoicing,
        bool HasAnyPrices,  // prices may exist outside the individual charge period's boundaries and thus may be true
        DateTimeOffset ValidFromDateTime,
        DateTimeOffset? ValidToDateTime);
