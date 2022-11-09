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
using Energinet.DataHub.MarketParticipant.Client.Models;
using Flurl.Http;

namespace Energinet.DataHub.MarketParticipant.Client
{
    internal static class ValidationExceptionHandler
    {
        public static async Task<T> HandleAsync<T>(Func<Task<T>> func)
        {
            try
            {
                return await func().ConfigureAwait(false);
            }
            catch (FlurlHttpException ex) when (ex.StatusCode == 400)
            {
                var responseJson = await ex.GetResponseStringAsync().ConfigureAwait(false);
                throw new MarketParticipantBadRequestException(responseJson);
            }
            catch (FlurlHttpException ex)
            {
                throw new MarketParticipantException(ex.StatusCode ?? 500, string.Empty);
            }
        }
    }
}
