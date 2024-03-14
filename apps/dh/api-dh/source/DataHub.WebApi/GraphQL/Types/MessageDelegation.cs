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

namespace Energinet.DataHub.WebApi.GraphQL
{
    public sealed class MessageDelegation
    {
        public MessageDelegationId Id { get; set; } = default!;

        public DelegationPeriodId PeriodId { get; set; } = default!;

        public ActorId DelegatedBy { get; set; } = default!;

        public ActorId DelegatedTo { get; set; } = default!;

        public GridAreaId GridAreaId { get; set; } = default!;

        public DelegationMessageType MessageType { get; set; } = default!;

        public System.DateTimeOffset StartsAt { get; set; } = default!;

        public System.DateTimeOffset? ExpiresAt { get; set; } = default!;
    }
}
