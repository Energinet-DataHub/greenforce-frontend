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

using System.Runtime.CompilerServices;
using Energinet.DataHub.WebApi.Modules.Common.Utilities;

namespace Energinet.DataHub.WebApi.Modules.Common.Models;

public record DocumentType : Enumeration<DocumentType>
{
    public static readonly DocumentType NotifyAggregatedMeasureData = new();
    public static readonly DocumentType NotifyWholesaleServices = new();
    public static readonly DocumentType RejectRequestAggregatedMeasureData = new();
    public static readonly DocumentType RejectRequestWholesaleSettlement = new();
    public static readonly DocumentType RequestAggregatedMeasureData = new();
    public static readonly DocumentType RequestWholesaleSettlement = new();
    public static readonly DocumentType ReminderOfMissingMeasurements = new();
    public static readonly DocumentType NotifyPriceList = new();
    public static readonly DocumentType RequestChangeOfPriceList = new();
    public static readonly DocumentType ConfirmRequestChangeOfPriceList = new();
    public static readonly DocumentType RejectRequestChangeOfPriceList = new();

    public static readonly DocumentType B2CRequestAggregatedMeasureData =
        new() { GraphQLName = "B2C_REQUEST_AGGREGATED_MEASURE_DATA" };

    public static readonly DocumentType B2CRequestWholesaleSettlement =
        new() { GraphQLName = "B2C_REQUEST_WHOLESALE_SETTLEMENT" };

    public static readonly DocumentType Acknowledgement = new();
    public static readonly DocumentType SendMeasurements = new();
    public static readonly DocumentType RequestMeasurements = new();
    public static readonly DocumentType RejectRequestMeasurements = new();
    public static readonly DocumentType UpdateChargeLinks = new();
    public static readonly DocumentType ConfirmRequestChangeBillingMasterData = new();
    public static readonly DocumentType RejectRequestChangeBillingMasterData = new();
    public static readonly DocumentType NotifyBillingMasterData = new();

    public static readonly DocumentType B2CUpdateChargeLinks =
        new() { GraphQLName = "B2C_UPDATE_CHARGE_LINKS" };

    public static readonly DocumentType B2CRequestChangeAccountingPointCharacteristics =
        new() { GraphQLName = "B2C_REQUEST_CHANGE_ACCOUNTING_POINT_CHARACTERISTICS" };

    public static readonly DocumentType B2CRequestChangeBillingMasterData =
        new() { GraphQLName = "B2C_REQUEST_CHANGE_BILLING_MASTER_DATA" };

    public static readonly DocumentType B2CRequestChangeOfPriceList =
        new() { GraphQLName = "B2C_REQUEST_CHANGE_OF_PRICE_LIST" };

    public static readonly DocumentType B2CRequestChangeOfSupplier =
        new() { GraphQLName = "B2C_REQUEST_CHANGE_OF_SUPPLIER" };

    public static readonly DocumentType B2CRequestChangeCustomerCharacteristics =
        new() { GraphQLName = "B2C_REQUEST_CHANGE_CUSTOMER_CHARACTERISTICS" };

    private DocumentType([CallerMemberName] string name = "")
        : base(name) { }
}
