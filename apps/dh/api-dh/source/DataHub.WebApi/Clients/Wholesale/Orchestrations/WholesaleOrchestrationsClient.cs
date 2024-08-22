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

using System.Text;
using Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations.Dto;
using Newtonsoft.Json;

namespace Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations;

/// <summary>
/// Implementation of client for working with the Wholesale Orchestrations API.
/// </summary>
public class WholesaleOrchestrationsClient : IWholesaleOrchestrationsClient
{
    public WholesaleOrchestrationsClient(string baseUrl, HttpClient httpClient)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(baseUrl);
        ArgumentNullException.ThrowIfNull(httpClient);

        BaseUrl = baseUrl;
        HttpClient = httpClient;

        HttpClient.BaseAddress = new Uri(BaseUrl);
    }

    public string BaseUrl { get; }

    protected HttpClient HttpClient { get; }

    public async Task<Guid> StartCalculationAsync(StartCalculationRequestDto requestDto, CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "api/StartCalculation");
        request.Content = new StringContent(
            JsonConvert.SerializeObject(requestDto),
            Encoding.UTF8,
            "application/json");

        using var actualResponse = await HttpClient.SendAsync(request, cancellationToken);
        actualResponse.EnsureSuccessStatusCode();

        var calculationId = await actualResponse.Content.ReadFromJsonAsync<Guid>(cancellationToken);
        return calculationId;
    }

    public async Task CancelScheduledCalculationAsync(
        CancelScheduledCalculationRequestDto requestDto,
        CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "api/CancelScheduledCalculation");
        request.Content = new StringContent(
            JsonConvert.SerializeObject(requestDto),
            Encoding.UTF8,
            "application/json");

        using var actualResponse = await HttpClient.SendAsync(request, cancellationToken);
        actualResponse.EnsureSuccessStatusCode();
    }
}
