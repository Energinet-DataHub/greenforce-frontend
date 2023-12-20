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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using GreenDonut;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class UserCacheDataLoader : CacheDataLoader<Guid, GetUserResponse>
    {
        private readonly IMarketParticipantClient_V1 _client;

        public UserCacheDataLoader(
            IMarketParticipantClient_V1 client,
            DataLoaderOptions? options = null)
            : base(options) =>
            _client = client;

        protected override Task<GetUserResponse> LoadSingleAsync(
            Guid key,
            CancellationToken cancellationToken) =>
            _client.UserAsync(key);
    }
}
