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

using Energinet.DataHub.MarketParticipant.Domain.Model;
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Model;

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Mappers
{
    internal sealed class ActorContactMapper
    {
        public static void MapToEntity(ActorContact from, ActorContactEntity to)
        {
            to.Id = from.Id.Value;
            to.ActorId = from.ActorId;
            to.Name = from.Name;
            to.Category = from.Category;
            to.Email = from.Email.Address;
            to.Phone = from.Phone?.Number;
        }

        public static ActorContact MapFromEntity(ActorContactEntity from)
        {
            var pn = from.Phone == null
                ? null
                : new PhoneNumber(from.Phone);

            return new ActorContact(
                new ContactId(from.Id),
                from.ActorId,
                from.Name,
                from.Category,
                new EmailAddress(from.Email),
                pn);
        }
    }
}
