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

using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Modules.MarketParticipant.GridAreas;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.Esett;

[ObjectType<ExchangeEventTrackingResult>]
public static partial class ExchangeEventTrackingResultNode
{
    private static readonly string _controllerName = "EsettExchange";

    [Query]
    public static async Task<ExchangeEventTrackingResult> GetEsettOutgoingMessageByIdAsync(
        string documentId,
        [Service] IESettExchangeClient_V1 client) =>
            await client.EsettAsync(documentId);

    #region Computed fields on ExchangeEventTrackingResult
    public static string? GetDispatchDocumentUrl(
        [Parent] ExchangeEventTrackingResult result,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] LinkGenerator linkGenerator) => linkGenerator.GetUriByAction(
            httpContextAccessor.HttpContext!,
            "GetDispatchDocument",
            _controllerName,
            new { documentId = result.DocumentId });

    public static string? GetResponseDocumentUrl(
        [Parent] ExchangeEventTrackingResult result,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] LinkGenerator linkGenerator) =>
            linkGenerator.GetUriByAction(
                httpContextAccessor.HttpContext!,
                "ResponseDocument",
                _controllerName,
                new { documentId = result.DocumentId });

    public static async Task<GridAreaDto?> GetGridAreaAsync(
        [Parent] ExchangeEventTrackingResult result,
        IGridAreaByCodeDataLoader dataLoader) =>
            await dataLoader.LoadAsync(result.GridAreaCode).ConfigureAwait(false);

    #endregion
    static partial void Configure(IObjectTypeDescriptor<ExchangeEventTrackingResult> descriptor)
    {
        descriptor
            .Name("EsettOutgoingMessage");

        descriptor
            .Field(f => f.PeriodFrom)
            .Name("period")
            .Resolve((context) =>
            {
                var trackingResult = context.Parent<ExchangeEventTrackingResult>();
                return new Interval(
                    Instant.FromDateTimeOffset(trackingResult.PeriodFrom),
                    Instant.FromDateTimeOffset(trackingResult.PeriodTo));
            });

        descriptor.Ignore(f => f.PeriodTo);
    }
}
