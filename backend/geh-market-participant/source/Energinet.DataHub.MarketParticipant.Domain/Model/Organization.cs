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
using System.Collections.ObjectModel;
using System.Linq;

namespace Energinet.DataHub.MarketParticipant.Domain.Model
{
    public sealed class Organization
    {
        private readonly OrganizationStatusTransitioner _organizationStatusTransitioner;

        public Organization(
            string name,
            BusinessRegisterIdentifier businessRegisterIdentifier,
            Address address)
        {
            Id = new OrganizationId(Guid.Empty);
            Name = name;
            Actors = new Collection<Actor>();
            BusinessRegisterIdentifier = businessRegisterIdentifier;
            Address = address;
            _organizationStatusTransitioner = new OrganizationStatusTransitioner();
        }

        public Organization(
            string name,
            BusinessRegisterIdentifier businessRegisterIdentifier,
            Address address,
            string? comment)
        {
            Id = new OrganizationId(Guid.Empty);
            Name = name;
            Actors = new Collection<Actor>();
            BusinessRegisterIdentifier = businessRegisterIdentifier;
            Address = address;
            Comment = comment;
            _organizationStatusTransitioner = new OrganizationStatusTransitioner();
        }

        public Organization(
            OrganizationId id,
            string name,
            IEnumerable<Actor> actors,
            BusinessRegisterIdentifier businessRegisterIdentifier,
            Address address,
            string? comment,
            OrganizationStatus status)
        {
            Id = id;
            Name = name;
            Actors = actors.ToList();
            BusinessRegisterIdentifier = businessRegisterIdentifier;
            Address = address;
            Comment = comment;
            _organizationStatusTransitioner = new OrganizationStatusTransitioner(status);
        }

        public OrganizationId Id { get; }

        public string Name { get; set; }

        public BusinessRegisterIdentifier BusinessRegisterIdentifier { get; set; }

        public Address Address { get; set; }

        public ICollection<Actor> Actors { get; }

        public string? Comment { get; set; }

        public OrganizationStatus Status
        {
            get => _organizationStatusTransitioner.Status;
            set => _organizationStatusTransitioner.Status = value;
        }

        /// <summary>
        /// Activates the current organization, the status changes to Active.
        /// Only New and Blocked  organizations can be activated.
        /// </summary>
        public void Activate() => _organizationStatusTransitioner.Activate();

        /// <summary>
        /// Blocks the current organization, the status changes to Blocked.
        /// </summary>
        public void Blocked() => _organizationStatusTransitioner.Blocked();

        /// <summary>
        /// Soft-deletes the current organization, the status changes to Deleted.
        /// </summary>
        public void Delete() => _organizationStatusTransitioner.Delete();
    }
}
