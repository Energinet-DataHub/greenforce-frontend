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

using Energinet.DataHub.WebApi.Modules.MessageArchive.Enums;
using SearchDocumentType = Energinet.DataHub.Edi.B2CWebApp.Clients.v3.DocumentType;

namespace Energinet.DataHub.WebApi.Modules.MessageArchive.Extensions;

public static class SearchDocumentTypeExtensions
{
    internal static DocumentType ToDocumentType(this SearchDocumentType documentType) =>
        documentType switch
        {
            SearchDocumentType.Acknowledgement => DocumentType.Acknowledgement,
            SearchDocumentType.B2CRequestAggregatedMeasureData => DocumentType.B2CRequestAggregatedMeasureData,
            SearchDocumentType.B2CRequestWholesaleSettlement => DocumentType.B2CRequestWholesaleSettlement,
            SearchDocumentType.NotifyAggregatedMeasureData => DocumentType.NotifyAggregatedMeasureData,
            SearchDocumentType.NotifyWholesaleServices => DocumentType.NotifyWholesaleServices,
            SearchDocumentType.RejectRequestAggregatedMeasureData => DocumentType.RejectRequestAggregatedMeasureData,
            SearchDocumentType.RejectRequestWholesaleSettlement => DocumentType.RejectRequestWholesaleSettlement,
            SearchDocumentType.RequestAggregatedMeasureData => DocumentType.RequestAggregatedMeasureData,
            SearchDocumentType.RequestWholesaleSettlement => DocumentType.RequestWholesaleSettlement,
        };
}
