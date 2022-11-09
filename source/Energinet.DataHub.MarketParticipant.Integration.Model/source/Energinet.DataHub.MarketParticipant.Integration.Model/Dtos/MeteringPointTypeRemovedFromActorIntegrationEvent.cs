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

namespace Energinet.DataHub.MarketParticipant.Integration.Model.Dtos
{
    public sealed record MeteringPointTypeRemovedFromActorIntegrationEvent : BaseIntegrationEvent
    {
        public MeteringPointTypeRemovedFromActorIntegrationEvent(
            Guid eventId,
            Guid actorId,
            Guid organizationId,
            EicFunction function,
            Guid gridAreaId,
            string meteringPointType,
            DateTime eventCreated)
            : base(eventId, eventCreated)
        {
            ActorId = actorId;
            OrganizationId = organizationId;
            Function = function;
            GridAreaId = gridAreaId;
            MeteringPointType = meteringPointType;
        }

        public Guid ActorId { get; }
        public Guid OrganizationId { get; }

        public EicFunction Function { get; }
        public Guid GridAreaId { get; }
        public string MeteringPointType { get; }
    }
}
