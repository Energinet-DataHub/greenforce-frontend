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

export enum DocumentTypes
{
' 294' = "Application acknowledgement and error report",
' 392' = "Request change of supplier",
' 414' = "Confirmation of start of supply",
' 432' = "Notification to grid operator of contract termination",
D01 = "Request re-allocate change of supplier",
D02 = "Response re-allocate change of supplier",
D03 = "Request Service",
D04 = "Response Servicerequest",
D05 = "Request Update Master Data Charge",
D06 = "Response Update Master Data Charge",
D07 = "Notify Master Data Charge ",
D08 = "Query Master Data Charge ",
D09 = "Response Master Data Charge ",
D10 = "Request update charge information",
D11 = "Response update charge information",
D12 = "Notify charge information",
D13 = "Query charge information",
D14 = "Response charge information",
D15 = "Request update Metering Point party",
D16 = "Response update Metering Point party",
D17 = "Response MasterData party ",
D18 = "Query all master data ",
D19 = "Reject all master data ",
D20 = "Response MasterData MeterinPoint",
D21 = "Request for Aggregated Billing Information",
D22 = "Response MasterData Meter",
D23 = "Notify Volumes",
D24 = "Notify missing data",
D25 = "Request missing data ",
E07 = "Master data, metering point",
E08 = "Master data, meter",
E10 = "Request for Master data, Metering point",
E21 = "Master data, Consumer",
E31 = "Aggregate metered data from the Metered Data Aggregator, local",
E38 = "Request Master data, meter",
E41 = "Request to Meter administrator (MA) for change in Meter-db",
E42 = "Response from Meter administrator (MA) for change in Meter-db",
E44 = "Notification to supplier",
E58 = "Request to change metering point attributes",
E59 = "Confirmation/rejection of change metering point attributes",
E66 = "Validated metered data, time series",
E67 = "Request regarding Cancellation",
E68 = "Response regarding Cancellation",
E73 = "Request for validated metered data",
E74 = "Request aggregated metered data",
E78 = "Cancellation of notification",
ERR = "Processability Error Report",

}
