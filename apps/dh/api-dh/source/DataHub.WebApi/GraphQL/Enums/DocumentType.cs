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

namespace Energinet.DataHub.WebApi.GraphQL.Enums;

public enum DocumentType
{
  ConfirmRequestChangeOfSupplier,
  RejectRequestChangeOfSupplier,
  RequestChangeOfSupplier,
  ConfirmRequestReallocateChangeOfSupplier,
  RejectRequestReallocateChangeOfSupplier,
  RequestReallocateChangeOfSupplier,
  GenericNotification,
  ConfirmRequestEndOfSupply,
  RejectRequestEndOfSupply,
  RequestEndOfSupply,
  RejectRequestAccountingPointCharacteristics,
  RequestAccountingPointCharacteristics,
  Acknowledgement,
  NotifyValidatedMeasureData,
  NotifyAggregatedMeasureData,
  RejectRequestValidatedMeasureData,
  RequestValidatedMeasureData,
  RejectRequestAggregatedMeasureData,
  RequestAggregatedMeasureData,
  RejectRequestWholesaleSettlement,
  RequestWholesaleSettlement,
  RejectRequestForReminders,
  ReminderOfMissingMeasureData,
  RequestForReminders,
  NotifyWholesaleServices,
  ConfirmRequestService,
  RejectRequestService,
  RequestService,
  ConfirmRequestChangeAccountingPointCharacteristics,
  RejectRequestChangeAccountingPointCharacteristics,
  RequestChangeAccountingPointCharacteristics,
  AccountingPointCharacteristics,
  ConfirmRequestCancellation,
  RejectRequestCancellation,
  RequestCancellation,
  NotifyCancellation,
  ConfirmRequestChangeCustomerCharacteristics,
  RejectRequestChangeCustomerCharacteristics,
  RequestChangeCustomerCharacteristics,
  CharacteristicsOfACustomerAtAnAP,
  ConfirmRequestChangeBillingMasterData,
  RejectRequestChangeBillingMasterData,
  RequestChangeBillingMasterData,
  NotifyBillingMasterData,
  RejectRequestBillingMasterData,
  RequestBillingMasterData,
  ConfirmRequestChangeOfPricelist,
  RejectRequestChangeOfPricelist,
  RequestChangeOfPricelist,
  NotifyPricelist,
  RejectRequestPricelist,
  RequestPricelist,
}
