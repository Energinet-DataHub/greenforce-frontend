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
using System.Collections.Generic;

namespace Energinet.DataHub.MarketParticipant.Integration.Model.Dtos
{
    public record ActorCreatedIntegrationEvent : BaseIntegrationEvent
    {
        public ActorCreatedIntegrationEvent(
            Guid eventId,
            Guid actorId,
            Guid organizationId,
            ActorStatus status,
            ActorNumber actorNumber,
            string name,
            IEnumerable<BusinessRoleCode> businessRoles,
            IEnumerable<ActorMarketRole> actorMarketRoles,
            DateTime eventCreated)
            : base(eventId, eventCreated)
        {
            ActorId = actorId;
            OrganizationId = organizationId;
            Status = status;
            ActorNumber = actorNumber;
            BusinessRoles = businessRoles;
            ActorMarketRoles = actorMarketRoles;
            Name = name;
        }

        public Guid ActorId { get; }
        public Guid OrganizationId { get; }
        public ActorStatus Status { get; }
        public ActorNumber ActorNumber { get; }
        public string Name { get; }
        public IEnumerable<BusinessRoleCode> BusinessRoles { get; }
        public IEnumerable<ActorMarketRole> ActorMarketRoles { get; }
    }
}
