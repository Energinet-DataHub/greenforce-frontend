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
using Energinet.DataHub.MarketParticipant.Client.Models;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class Actor
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string GlnOrEicNumber { get; set; }

        public EicFunction? MarketRole { get; set; }

        public GridAreaDto[] GridAreas { get; set; } = Array.Empty<GridAreaDto>();

        public ActorStatus Status { get; set; }

        public OrganizationDto? Organization { get; set; }

        public Actor(Guid id, string name, string glnOrEicNumber)
        {
            Id = id;
            Name = name;
            GlnOrEicNumber = glnOrEicNumber;
        }
    }
}
