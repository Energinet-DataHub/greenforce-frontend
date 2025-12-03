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

using Energinet.DataHub.WebApi.Modules.Processes.ChangeOfSupplier.Models;

namespace Energinet.DataHub.WebApi.Modules.Processes.ChangeOfSupplier;

public class ChangeOfSupplierClient : IChangeOfSupplierClient
{
    private readonly HttpClient _httpClient;

    public ChangeOfSupplierClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<bool> RequestChangeOfSupplierAsync(RequestChangeOfSupplierInput input, CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.PostAsJsonAsync("/api/v1/RequestChangeOfSupplier/request", input, cancellationToken);
        return response.IsSuccessStatusCode;
    }
}
