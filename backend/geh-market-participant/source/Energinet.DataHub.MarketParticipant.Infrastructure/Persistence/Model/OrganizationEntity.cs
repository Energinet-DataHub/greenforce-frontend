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
using System.Collections.ObjectModel;

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Model
{
    public sealed class OrganizationEntity
    {
        public OrganizationEntity()
        {
            Name = string.Empty;
            Actors = new Collection<ActorEntity>();
            BusinessRegisterIdentifier = string.Empty;
            Address = new AddressEntity();
            Status = 1;
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string BusinessRegisterIdentifier { get; set; }
        public string? Comment { get; set; }
        public int Status { get; set; }
        public AddressEntity Address { get; set; }

        public Collection<ActorEntity> Actors { get; }
    }
}
