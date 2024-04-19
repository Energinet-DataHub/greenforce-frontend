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
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL.Types;

public class BalanceResponsibilityAgreement : ObjectType<BalanceResponsibilityAgreementDto>
{
    protected override void Configure(IObjectTypeDescriptor<BalanceResponsibilityAgreementDto> descriptor)
    {
        descriptor.Name(nameof(BalanceResponsibilityAgreement));
        descriptor
            .Field(x => x.MeteringPointType)
            .Resolve(c => Enum.GetName(c.Parent<BalanceResponsibilityAgreementDto>().MeteringPointType));

        descriptor
            .Field(x => x.ValidFrom)
            .Ignore();

        descriptor
            .Field(x => x.ValidTo)
            .Ignore();

        descriptor
            .Field("validPeriod")
            .Resolve((ctx, _) =>
            {
                var balanceResponsibilityAgreement = ctx.Parent<BalanceResponsibilityAgreementDto>();
                return new Interval(Instant.FromDateTimeOffset(balanceResponsibilityAgreement.ValidFrom), balanceResponsibilityAgreement.ValidTo != null ? Instant.FromDateTimeOffset(balanceResponsibilityAgreement.ValidTo.Value) : null);
            });

        descriptor
            .Field("status")
            .Resolve((ctx, _) =>
            {
                var balanceResponsibilityAgreement = ctx.Parent<BalanceResponsibilityAgreementDto>();
                var validPeriod = new Interval(Instant.FromDateTimeOffset(balanceResponsibilityAgreement.ValidFrom), balanceResponsibilityAgreement.ValidTo != null ? Instant.FromDateTimeOffset(balanceResponsibilityAgreement.ValidTo.Value) : null);

                if (validPeriod.Start < Instant.FromDateTimeOffset(DateTimeOffset.UtcNow) && (!validPeriod.HasEnd || validPeriod.End > Instant.FromDateTimeOffset(DateTimeOffset.UtcNow)))
                {
                    return BalanceResponsibilityAgreementStatus.Active;
                }

                if (validPeriod.HasEnd && validPeriod.End < Instant.FromDateTimeOffset(DateTimeOffset.UtcNow))
                {
                    return BalanceResponsibilityAgreementStatus.Expired;
                }

                if (validPeriod.HasEnd && validPeriod.End < Instant.FromDateTimeOffset(DateTimeOffset.UtcNow).Minus(Duration.FromDays(7)))
                {
                    return BalanceResponsibilityAgreementStatus.SoonToExpire;
                }

                return BalanceResponsibilityAgreementStatus.Awaiting;
            });
    }
}
