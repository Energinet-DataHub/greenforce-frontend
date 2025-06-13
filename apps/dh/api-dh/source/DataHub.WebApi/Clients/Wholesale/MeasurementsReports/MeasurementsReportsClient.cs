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
using Energinet.DataHub.WebApi.Clients.Wholesale.MeasurementsReports.Dto;
using Newtonsoft.Json;

namespace Energinet.DataHub.WebApi.Clients.Wholesale.MeasurementsReports;

public sealed class MeasurementsReportsClient : IMeasurementsReportsClient
{
    private readonly HttpClient _apiHttpClient;

    public MeasurementsReportsClient(HttpClient apiHttpClient)
    {
        ArgumentNullException.ThrowIfNull(apiHttpClient);
        _apiHttpClient = apiHttpClient;
    }

    public async Task RequestAsync(MeasurementsReportRequestDto requestDto, CancellationToken cancellationToken)
    {
        if (IsPeriodAcrossMonths(requestDto.Filter))
        {
            throw new ArgumentException("Invalid period, start date and end date should be within same month", nameof(requestDto));
        }

        using var request = new HttpRequestMessage(HttpMethod.Post, "measurements-reports/request");

        request.Content = new StringContent(
            JsonConvert.SerializeObject(requestDto),
            Encoding.UTF8,
            "application/json");

        Task<HttpResponseMessage> responseMessage = _apiHttpClient.SendAsync(request, cancellationToken);

        using var response = await responseMessage;
        response.EnsureSuccessStatusCode();
    }

    public async Task<IEnumerable<RequestedMeasurementsReportDto>> GetAsync(CancellationToken cancellationToken)
    {
        using var requestApi = new HttpRequestMessage(HttpMethod.Get, "measurements-reports/list");

        using var response = await _apiHttpClient.SendAsync(requestApi, cancellationToken);

        response.EnsureSuccessStatusCode();

        var responseApiContent = await response.Content.ReadFromJsonAsync<IEnumerable<RequestedMeasurementsReportDto>>(cancellationToken) ?? [];

        return responseApiContent.OrderByDescending(x => x.CreatedDateTime);
    }

    public async Task<Stream> DownloadAsync(MeasurementsReportRequestId requestId, CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "measurements-reports/download");
        request.Content = new StringContent(
            JsonConvert.SerializeObject(requestId),
            Encoding.UTF8,
            "application/json");

        var response = await _apiHttpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadAsStreamAsync(cancellationToken);
    }

    public async Task CancelAsync(MeasurementsReportRequestId requestId, CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "measurements-reports/cancel");

        request.Content = new StringContent(
            JsonConvert.SerializeObject(requestId),
            Encoding.UTF8,
            "application/json");

        using var responseMessage = await _apiHttpClient.SendAsync(request, cancellationToken);
        responseMessage.EnsureSuccessStatusCode();
    }

    private static bool IsPeriodAcrossMonths(MeasurementsReportRequestFilterDto measurementsReportRequestFilter)
    {
        var startDate = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(measurementsReportRequestFilter.PeriodStart, "Romance Standard Time");
        var endDate = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(measurementsReportRequestFilter.PeriodEnd.AddMilliseconds(-1), "Romance Standard Time");
        return startDate.Month != endDate.Month
            || startDate.Year != endDate.Year;
    }
}
