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

using Energinet.DataHub.Charges.Abstractions.Api.Models.ChargeLink;
using Energinet.DataHub.Charges.Abstractions.Api.SearchCriteria;
using Energinet.DataHub.Charges.Abstractions.Shared;
using Energinet.DataHub.EDI.B2CClient;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeBillingMasterData.V1.Commands;
using Energinet.DataHub.EDI.B2CClient.Abstractions.RequestChangeBillingMasterData.V1.Models;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Charges.Models;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.Charges.Client;

public class ChargeLinkClient(DataHub.Charges.Client.IChargesClient chargesClient, IB2CClient b2cClient) : IChargeLinkClient
{
    public async Task<IEnumerable<ChargeLinkDto>> GetChargeLinksByMeteringPointIdAsync(string meteringPointId, CancellationToken ct = default)
    {
        var result = await chargesClient.GetChargeLinksAsync(new ChargeLinksSearchCriteriaDto(meteringPointId), ct).ConfigureAwait(false);
        return result.Value ?? Enumerable.Empty<ChargeLinkDto>();
    }

    public async Task<bool> StopChargeLinkAsync(ChargeIdentifierDto ident, string meteringPointId, DateTimeOffset stopDate, CancellationToken ct = default) =>
        (await b2cClient.SendAsync(new StopChargeLinkCommandV1(new StopChargeLinkRequestV1(ident.Code, ident.Owner, ToRequestChangeBillingMasterDataChargeType(ident.Type), meteringPointId, stopDate)), ct).ConfigureAwait(false)).IsSuccess;

    public async Task<bool> CancelChargeLinkAsync(ChargeIdentifierDto ident, string meteringPointId, CancellationToken ct = default) =>
        (await b2cClient.SendAsync(new StopChargeLinkCommandV1(new StopChargeLinkRequestV1(ident.Code, ident.Owner, ToRequestChangeBillingMasterDataChargeType(ident.Type), meteringPointId, DateTimeOffset.Now)), ct).ConfigureAwait(false)).IsSuccess;

    public async Task<bool> EditChargeLinkAsync(ChargeIdentifierDto ident, string meteringPointId, DateTimeOffset newStartDate, int factor, CancellationToken ct = default)
    {
        var editRequest = new UpsertChargeLinkRequestV1(ident.Code, ident.Owner, ToRequestChangeBillingMasterDataChargeType(ident.Type), meteringPointId, newStartDate, factor.ToString());
        return (await b2cClient.SendAsync(new UpsertChargeLinkCommandV1(editRequest), ct).ConfigureAwait(false)).IsSuccess;
    }

    public async Task<bool> CreateChargeLinkAsync(ChargeIdentifierDto ident, string meteringPointId, DateTimeOffset newStartDate, int factor, CancellationToken ct = default)
    {
        var createRequest = new UpsertChargeLinkRequestV1(ident.Code, ident.Owner, ToRequestChangeBillingMasterDataChargeType(ident.Type), meteringPointId, newStartDate, factor.ToString());
        return (await b2cClient.SendAsync(new UpsertChargeLinkCommandV1(createRequest), ct).ConfigureAwait(false)).IsSuccess;
    }

    private ChargeTypeV1 ToRequestChangeBillingMasterDataChargeType(ChargeType type) => type switch
    {
        ChargeType.Tariff => ChargeTypeV1.Tariff,
        ChargeType.Subscription => ChargeTypeV1.Subscription,
        ChargeType.Fee => ChargeTypeV1.Fee,
    };
}
