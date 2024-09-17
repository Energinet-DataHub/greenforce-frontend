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
using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports.Dto;
using Newtonsoft.Json;

namespace Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports;

public sealed class SettlementReportsClient : ISettlementReportsClient
{
    private readonly HttpClient _httpClient;
    private readonly HttpClient _apiHttpClient;

    public SettlementReportsClient(string baseUrl, HttpClient httpClient,  HttpClient apiHttpClient)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(baseUrl);
        ArgumentNullException.ThrowIfNull(httpClient);
        ArgumentNullException.ThrowIfNull(apiHttpClient);

        _httpClient = httpClient;
        _apiHttpClient = apiHttpClient;
    }

    public async Task RequestAsync(SettlementReportRequestDto requestDto, CancellationToken cancellationToken)
    {
            using var request = requestDto.UseAPI
                ? new HttpRequestMessage(HttpMethod.Post, "settlement-reports/RequestSettlementReport")
                : new HttpRequestMessage(HttpMethod.Post, "api/RequestSettlementReport");

            request.Content = new StringContent(
                JsonConvert.SerializeObject(requestDto),
                Encoding.UTF8,
                "application/json");

            using var response = await (requestDto.UseAPI
                ? _apiHttpClient.SendAsync(request, cancellationToken)
                : _httpClient.SendAsync(request, cancellationToken));

            response.EnsureSuccessStatusCode();
    }

    public async Task<IEnumerable<RequestedSettlementReportDto>> GetAsync(CancellationToken cancellationToken)
    {
        using var requestApi = new HttpRequestMessage(HttpMethod.Get, "settlement-reports/list");
        using var request = new HttpRequestMessage(HttpMethod.Get, "api/ListSettlementReports");

        using var actualResponseApi = await _apiHttpClient.SendAsync(requestApi, cancellationToken);
        using var actualResponse = await _httpClient.SendAsync(request, cancellationToken);

        actualResponseApi.EnsureSuccessStatusCode();
        actualResponse.EnsureSuccessStatusCode();

        var actualResponseContent = await actualResponse.Content.ReadFromJsonAsync<IEnumerable<RequestedSettlementReportDto>>(cancellationToken) ?? [];
        var actualResponseApiContent = await actualResponseApi.Content.ReadFromJsonAsync<IEnumerable<RequestedSettlementReportDto>>(cancellationToken) ?? [];
        return actualResponseContent.Concat(actualResponseApiContent).OrderByDescending(x => x.CreatedDateTime);
    }

    public async Task<Stream> DownloadAsync(SettlementReportRequestId requestId, bool fromApi, CancellationToken cancellationToken)
    {
        using var requestApi = new HttpRequestMessage(HttpMethod.Get, "settlement-reports/download");
        using var request = new HttpRequestMessage(HttpMethod.Post, "api/SettlementReportDownload");
        request.Content = new StringContent(
            JsonConvert.SerializeObject(requestId),
            Encoding.UTF8,
            "application/json");

        var response = await (fromApi
        ? _apiHttpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken)
        : _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken));

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadAsStreamAsync(cancellationToken);
    }
}
