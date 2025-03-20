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

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.Esett.Models;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor.Models;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.Esett.Types;

[ObjectType<BalanceResponsibilityRelationDto>]
public static partial class BalanceResponsibilityAgreement
{
    public static async Task<GridAreaDto?> GetGridAreaAsync(
        [Parent] BalanceResponsibilityRelationDto result,
        IGridAreaByIdDataLoader dataLoader) =>
            await dataLoader.LoadAsync(result.GridAreaId).ConfigureAwait(false);

    public static Task<ActorNameWithId?> GetEnergySupplierWithNameAsync(
        [Parent] BalanceResponsibilityRelationDto result,
        IActorNameByIdBatchDataLoader dataLoader) =>
            dataLoader.LoadAsync(result.EnergySupplierId);

    public static Task<ActorNameWithId?> GetBalanceResponsibleWithNameAsync(
       [Parent] BalanceResponsibilityRelationDto result,
       IActorNameByIdBatchDataLoader dataLoader) =>
            dataLoader.LoadAsync(result.BalanceResponsibleId);

    static partial void Configure(IObjectTypeDescriptor<BalanceResponsibilityRelationDto> descriptor)
    {
        descriptor
            .Name("BalanceResponsibilityAgreement")
            .BindFieldsExplicitly();

        descriptor
            .Field(x => x.MeteringPointType);

        descriptor
            .Field("validPeriod")
            .Resolve((ctx, _) =>
            {
                var balanceResponsibilityAgreement = ctx.Parent<BalanceResponsibilityRelationDto>();
                return new Interval(Instant.FromDateTimeOffset(balanceResponsibilityAgreement.ValidFrom), balanceResponsibilityAgreement.ValidTo != null ? Instant.FromDateTimeOffset(balanceResponsibilityAgreement.ValidTo.Value) : null);
            });

        descriptor
            .Field("status")
            .Resolve((ctx, _) =>
            {
                var balanceResponsibilityAgreement = ctx.Parent<BalanceResponsibilityRelationDto>();
                var dateTimeNow = DateTimeOffset.UtcNow;
                var validPeriod = new Interval(Instant.FromDateTimeOffset(balanceResponsibilityAgreement.ValidFrom), balanceResponsibilityAgreement.ValidTo != null ? Instant.FromDateTimeOffset(balanceResponsibilityAgreement.ValidTo.Value) : null);

                if (validPeriod.HasEnd && validPeriod.End.Minus(Instant.FromDateTimeOffset(dateTimeNow)).ToTimeSpan().TotalDays < 7 && validPeriod.End > Instant.FromDateTimeOffset(dateTimeNow))
                {
                    return BalanceResponsibilityAgreementStatus.SoonToExpire;
                }

                if (validPeriod.Start < Instant.FromDateTimeOffset(dateTimeNow) && (!validPeriod.HasEnd || validPeriod.End > Instant.FromDateTimeOffset(dateTimeNow)))
                {
                    return BalanceResponsibilityAgreementStatus.Active;
                }

                if (validPeriod.HasEnd && validPeriod.End < Instant.FromDateTimeOffset(dateTimeNow))
                {
                    return BalanceResponsibilityAgreementStatus.Expired;
                }

                return BalanceResponsibilityAgreementStatus.Awaiting;
            });
    }
}
