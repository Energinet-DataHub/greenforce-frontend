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
    public sealed record OrganizationCreatedIntegrationEvent : BaseIntegrationEvent
    {
        /// <summary>
        /// An event representing an update to a given GridArea.
        /// </summary>
        /// <param name="id">Unique integration event ID.</param>
        /// <param name="eventCreated"></param>
        /// <param name="organizationId">Organization ID.</param>
        /// <param name="name">Name of the Grid Area.</param>
        /// <param name="businessRegisterIdentifier">The Business registration code for this organization</param>
        /// <param name="address">The address of this organization</param>
        /// <param name="status">Organization status</param>
        public OrganizationCreatedIntegrationEvent(
            Guid id,
            DateTime eventCreated,
            Guid organizationId,
            string name,
            string businessRegisterIdentifier,
            Address address,
            OrganizationStatus status)
        : base(id, eventCreated)
        {
            OrganizationId = organizationId;
            Name = name;
            BusinessRegisterIdentifier = businessRegisterIdentifier;
            Address = address;
            Status = status;
        }

        public Guid OrganizationId { get; }
        public string Name { get; }
        public string BusinessRegisterIdentifier { get; }
        public Address Address { get; }
        public string? Comment { get; set; }
        public OrganizationStatus Status { get; set; }
    }
}
