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

namespace Energinet.DataHub.WebApi.Modules.MessageArchive.Enums;

public enum DocumentType
{
    Acknowledgement,
    SendMeasurements,
    RequestMeasurements,
    RejectRequestMeasurements,
    NotifyAggregatedMeasureData,
    RejectRequestAggregatedMeasureData,
    RequestAggregatedMeasureData,
    [GraphQLName("B2C_REQUEST_AGGREGATED_MEASURE_DATA")]
    B2CRequestAggregatedMeasureData,
    RejectRequestWholesaleSettlement,
    RequestWholesaleSettlement,
    [GraphQLName("B2C_REQUEST_WHOLESALE_SETTLEMENT")]
    B2CRequestWholesaleSettlement,
    NotifyWholesaleServices,
    ReminderOfMissingMeasurements,
    UpdateChargeLinks,
    ConfirmRequestChangeBillingMasterData,
    RejectRequestChangeBillingMasterData,
    NotifyBillingMasterData,
    RequestChangeOfPriceList,
    ConfirmRequestChangeOfPriceList,
    RejectRequestChangeOfPriceList,
    [GraphQLName("B2C_REQUEST_CHANGE_ACCOUNTING_POINT_CHARACTERISTICS")]
    B2CRequestChangeAccountingPointCharacteristics,
    [GraphQLName("B2C_REQUEST_CHANGE_BILLING_MASTER_DATA")]
    B2CRequestChangeBillingMasterData,
    [GraphQLName("B2C_REQUEST_CHANGE_OF_PRICE_LIST")]
    B2CRequestChangeOfPriceList,
    [GraphQLName("B2C_REQUEST_CHANGE_OF_SUPPLIER")]
    B2CRequestChangeOfSupplier,
    [GraphQLName("B2C_REQUEST_CHANGE_CUSTOMER_CHARACTERISTICS")]
    B2CRequestChangeCustomerCharacteristics,
}
