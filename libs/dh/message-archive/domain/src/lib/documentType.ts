//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { DocumentType } from '@energinet-datahub/dh/shared/domain/graphql';

export const getDocumentTypeIdentifier = (documentType: DocumentType) => {
  switch (documentType as DocumentType) {
    case DocumentType.B2CRequestChangeOfSupplier:
      return 'RSM-001';
    case DocumentType.Acknowledgement:
      return 'RSM-009';
    case DocumentType.SendMeasurements:
      return 'RSM-012';
    case DocumentType.NotifyAggregatedMeasureData:
      return 'RSM-014';
    case DocumentType.RequestMeasurements:
    case DocumentType.RejectRequestMeasurements:
      return 'RSM-015';
    case DocumentType.RejectRequestAggregatedMeasureData:
    case DocumentType.RequestAggregatedMeasureData:
    case DocumentType.B2CRequestAggregatedMeasureData:
      return 'RSM-016';
    case DocumentType.RejectRequestWholesaleSettlement:
    case DocumentType.RequestWholesaleSettlement:
    case DocumentType.B2CRequestWholesaleSettlement:
      return 'RSM-017';
    case DocumentType.ReminderOfMissingMeasurements:
      return 'RSM-018';
    case DocumentType.NotifyWholesaleServices:
      return 'RSM-019';
    case DocumentType.B2CRequestChangeAccountingPointCharacteristics:
      return 'RSM-021';
    case DocumentType.B2CRequestChangeCustomerCharacteristics:
      return 'RSM-027';
    case DocumentType.B2CUpdateChargeLinks:
    case DocumentType.UpdateChargeLinks:
    case DocumentType.ConfirmRequestChangeBillingMasterData:
    case DocumentType.RejectRequestChangeBillingMasterData:
    case DocumentType.B2CRequestChangeBillingMasterData:
      return 'RSM-030';
    case DocumentType.NotifyBillingMasterData:
      return 'RSM-031';
    case DocumentType.RequestChangeOfPriceList:
    case DocumentType.ConfirmRequestChangeOfPriceList:
    case DocumentType.RejectRequestChangeOfPriceList:
    case DocumentType.B2CRequestChangeOfPriceList:
      return 'RSM-033';
    case DocumentType.NotifyPriceList:
      return 'RSM-034';
  }
};
