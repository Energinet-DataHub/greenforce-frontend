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
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using GreenDonut;
using HotChocolate.Utilities;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class UserCacheDataLoader : CacheDataLoader<Guid, UserDto>
    {
        private readonly IMarketParticipantClient _client;

        public UserCacheDataLoader(
            IMarketParticipantClient client,
            DataLoaderOptions? options = null)
            : base(options) =>
            _client = client;

        protected override Task<UserDto> LoadSingleAsync(
            Guid key,
            CancellationToken cancellationToken) =>
            _client.GetUserAsync(key);
    }
}
