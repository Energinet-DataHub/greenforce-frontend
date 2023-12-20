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
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto;
using HotChocolate;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class ActorAuditLog
    {
        [GraphQLIgnore]
        public Guid? ChangedByUserId { get; set; }

        public string? CurrentValue { get; set; }

        public string? PreviousValue { get; set; }

        public DateTimeOffset Timestamp { get; set; }

        public ActorAuditLogType Type { get; set; }

        public ContactCategory ContactCategory { get; set; }

        public async Task<string> GetChangedByUserNameAsync(AuditIdentityCacheDataLoader dataLoader)
        {
            return ChangedByUserId is null
                ? "DataHub"
                : await dataLoader.LoadAsync(ChangedByUserId.Value).Then(x => x.DisplayName);
        }
    }
}
