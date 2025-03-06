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

using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.MarketParticipant.Actor.Models;

public static class ProcessDelegationExtension
{
    public static ActorDelegationStatus Status(this ProcessDelegation processDelegation)
    {
        {
            var validPeriod = processDelegation.ValidPeriod;

            if (validPeriod.HasEnd && validPeriod.End <= validPeriod.Start)
            {
                return ActorDelegationStatus.Cancelled;
            }

            if (validPeriod.Start < Instant.FromDateTimeOffset(DateTimeOffset.UtcNow) && (!validPeriod.HasEnd || validPeriod.End > Instant.FromDateTimeOffset(DateTimeOffset.UtcNow)))
            {
                return ActorDelegationStatus.Active;
            }

            if (validPeriod.HasEnd && validPeriod.End < Instant.FromDateTimeOffset(DateTimeOffset.UtcNow))
            {
                return ActorDelegationStatus.Expired;
            }

            return ActorDelegationStatus.Awaiting;
        }
    }
}
