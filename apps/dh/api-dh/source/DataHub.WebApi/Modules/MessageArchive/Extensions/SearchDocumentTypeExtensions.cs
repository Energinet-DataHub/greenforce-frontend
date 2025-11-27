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

using Energinet.DataHub.EDI.B2CClient.Abstractions.ArchivedMessages.V1;
using Energinet.DataHub.EDI.B2CClient.Abstractions.MeteringPointArchivedMessages.V1;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Enums;

namespace Energinet.DataHub.WebApi.Modules.MessageArchive.Extensions;

public static class SearchDocumentTypeExtensions
{
    internal static DocumentType ToDocumentType(this DocumentTypeDtoV1 documentType) =>
        documentType switch
        {
            DocumentTypeDtoV1.Acknowledgement => DocumentType.Acknowledgement,
            DocumentTypeDtoV1.B2CRequestAggregatedMeasureData => DocumentType.B2CRequestAggregatedMeasureData,
            DocumentTypeDtoV1.B2CRequestWholesaleSettlement => DocumentType.B2CRequestWholesaleSettlement,
            DocumentTypeDtoV1.NotifyAggregatedMeasureData => DocumentType.NotifyAggregatedMeasureData,
            DocumentTypeDtoV1.NotifyWholesaleServices => DocumentType.NotifyWholesaleServices,
            DocumentTypeDtoV1.RejectRequestAggregatedMeasureData => DocumentType.RejectRequestAggregatedMeasureData,
            DocumentTypeDtoV1.RejectRequestWholesaleSettlement => DocumentType.RejectRequestWholesaleSettlement,
            DocumentTypeDtoV1.RequestAggregatedMeasureData => DocumentType.RequestAggregatedMeasureData,
            DocumentTypeDtoV1.RequestWholesaleSettlement => DocumentType.RequestWholesaleSettlement,
            DocumentTypeDtoV1.ReminderOfMissingMeasurements => DocumentType.ReminderOfMissingMeasurements,
            // TODO: No mapping for DocumentTypeDtoV1.RequestChangeOfPriceList ?
            _ => throw new ArgumentOutOfRangeException(nameof(documentType), documentType, null),
        };

    internal static DocumentType ToDocumentType(this MeteringPointDocumentTypeDtoV1 documentType) =>
        documentType switch
        {
            MeteringPointDocumentTypeDtoV1.Acknowledgement => DocumentType.Acknowledgement,
            MeteringPointDocumentTypeDtoV1.SendMeasurements => DocumentType.SendMeasurements,
            MeteringPointDocumentTypeDtoV1.RequestMeasurements => DocumentType.RequestMeasurements,
            MeteringPointDocumentTypeDtoV1.RejectRequestMeasurements => DocumentType.RejectRequestMeasurements,
            MeteringPointDocumentTypeDtoV1.UpdateChargeLinks => DocumentType.UpdateChargeLinks,
            MeteringPointDocumentTypeDtoV1.ConfirmRequestChangeBillingMasterData => DocumentType.ConfirmRequestChangeBillingMasterData,
            MeteringPointDocumentTypeDtoV1.RejectRequestChangeBillingMasterData => DocumentType.RejectRequestChangeBillingMasterData,
            // TODO: No mapping for NotifyBillingMasterData ?
            _ => throw new ArgumentOutOfRangeException(nameof(documentType), documentType, null),
        };
}
