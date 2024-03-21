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
using Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto;
using HotChocolate.Types;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public sealed class MessageDelegationType : ObjectType<MessageDelegation>
    {
        protected override void Configure(IObjectTypeDescriptor<MessageDelegation> descriptor)
        {
            descriptor.Name("MessageDelegationType");

            descriptor.Ignore(f => f.GridAreaId);
            descriptor
                .Field("gridArea")
                .ResolveWith<MarketParticipantResolvers>(c => c.GetGridAreaAsync(default!, default!));

            descriptor
                .Field("delegatedBy")
                .ResolveWith<MarketParticipantResolvers>(c => c.GetActorDelegatedByAsync(default!, default!));

            descriptor
                .Field("delegatedTo")
                .ResolveWith<MarketParticipantResolvers>(c => c.GetActorDelegatedToAsync(default!, default!));

            descriptor
                .Field("status")
                .Resolve((ctx, ct) =>
                {
                    var validPeriod = ctx.Parent<MessageDelegation>().ValidPeriod;

                    if (validPeriod.HasEnd && validPeriod.End <= validPeriod.Start)
                    {
                        return ActorDelegationStatus.Cancelled;
                    }
                    else if (validPeriod.Start < Instant.FromDateTimeOffset(DateTimeOffset.UtcNow) && (!validPeriod.HasEnd || validPeriod.End > Instant.FromDateTimeOffset(DateTimeOffset.UtcNow)))
                    {
                        return ActorDelegationStatus.Active;
                    }
                    else if (validPeriod.HasEnd && validPeriod.End < Instant.FromDateTimeOffset(DateTimeOffset.UtcNow))
                    {
                        return ActorDelegationStatus.Expired;
                    }

                    return ActorDelegationStatus.Awaiting;
                });
        }
    }
}
