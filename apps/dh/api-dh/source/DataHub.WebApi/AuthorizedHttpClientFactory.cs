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
using System.Text.Json;
using Energinet.DataHub.Measurements.Client;
using Energinet.DataHub.Measurements.Client.ResponseParsers;
using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;
using Energinet.DataHub.WebApi.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Energinet.DataHub.WebApi;

/// <summary>
/// Factory to create an <see cref="T:System.Net.Http.HttpClient" />, which will re-apply the authorization header
/// from the current HTTP context.
/// </summary>
public class AuthorizedHttpClientFactory
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly Func<string> _authorizationHeaderProvider;
    private readonly IOptions<SubSystemBaseUrls> _baseUrls;

    public AuthorizedHttpClientFactory(
        IHttpClientFactory httpClientFactory,
        Func<string> authorizationHeaderProvider,
        IOptions<SubSystemBaseUrls> baseUrls)
    {
        _httpClientFactory = httpClientFactory;
        _authorizationHeaderProvider = authorizationHeaderProvider;
        _baseUrls = baseUrls;
    }

    public HttpClient CreateClient(Uri baseUrl)
    {
        var client = _httpClientFactory.CreateClient();
        SetAuthorizationHeader(client);
        client.BaseAddress = baseUrl;
        return client;
    }

    public ElectricityMarketClient_V1 CreateElectricityMarketClientWithSignature(MarketParticipant.Authorization.Model.Signature signature)
    {
        var signatureBase64 = ConvertSignatureToBase64(signature);
        var client = _httpClientFactory.CreateClient();
        SetAuthorizationHeader(client);
        client.DefaultRequestHeaders.Add("Signature", signatureBase64);
        client.BaseAddress = new(_baseUrls.Value.ElectricityMarketBaseUrl);
        return new ElectricityMarketClient_V1(_baseUrls.Value.ElectricityMarketBaseUrl, client);
    }

    public MeasurementsClient CreateMeasurementClientWithSignature(MarketParticipant.Authorization.Model.Signature signature, MeasurementsDtoResponseParser measurementsDtoResponseParser)
    {
        var signatureBase64 = ConvertSignatureToBase64(signature);
        var client = _httpClientFactory.CreateClient();
        SetAuthorizationHeader(client);
        client.DefaultRequestHeaders.Add("Signature", signatureBase64);

        return new MeasurementsClient(_httpClientFactory, measurementsDtoResponseParser);
    }

    private static string ConvertSignatureToBase64(MarketParticipant.Authorization.Model.Signature signature)
    {
        var signatureJson = JsonSerializer.Serialize(signature);
        var signatureByteArray = System.Text.Encoding.UTF8.GetBytes(signatureJson);
        return Base64UrlEncoder.Encode(signatureByteArray);
    }

    private void SetAuthorizationHeader(HttpClient httpClient)
    {
        var str = _authorizationHeaderProvider();
        if (string.IsNullOrEmpty(str))
        {
            return;
        }

        httpClient.DefaultRequestHeaders.Add("Authorization", str);
    }
}
