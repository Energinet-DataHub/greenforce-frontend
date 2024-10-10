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
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Energinet.DataHub.WebApi.GraphQL.Resolvers;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL.Types.Balance;

public class BalanceResponsibilityAgreement : ObjectType<BalanceResponsibilityRelationDto>
{
    protected override void Configure(IObjectTypeDescriptor<BalanceResponsibilityRelationDto> descriptor)
    {
        descriptor.Name(nameof(BalanceResponsibilityAgreement));

        descriptor
            .Field(x => x.MeteringPointType);

        descriptor
            .Field(x => x.GridAreaId)
            .Name("gridArea")
            .ResolveWith<MarketParticipantResolvers>(c => c.GetGridAreaForBalanceResponsibilityRelationAsync(default!, default!));

        descriptor
            .Field(x => x.ValidFrom)
            .Ignore();

        descriptor
            .Field(x => x.ValidTo)
            .Ignore();

        descriptor
            .Field(f => f.EnergySupplierId)
            .Name("energySupplierWithName")
            .ResolveWith<MarketParticipantResolvers>(c => c.GetEnergySupplierWithNameAsync(default!, default!));

        descriptor
            .Field(f => f.BalanceResponsibleId)
            .Name("balanceResponsibleWithName")
            .ResolveWith<MarketParticipantResolvers>(c => c.GetBalanceResponsibleWithNameAsync(default!, default!));

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
