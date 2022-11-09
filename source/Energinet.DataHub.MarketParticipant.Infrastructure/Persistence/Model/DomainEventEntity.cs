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

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Model
{
    public sealed class DomainEventEntity
    {
        public int Id { get; set; }
        public Guid EntityId { get; set; }
        public string EntityType { get; set; } = null!;
        public bool IsSent { get; set; }
        public DateTimeOffset Timestamp { get; set; }
        public string Event { get; set; } = null!;
        public string EventTypeName { get; set; } = null!;
    }
}
