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

export enum DocumentTypes {
  ConfirmRequestChangeOfSupplier = 'RSM-001',
  RejectRequestChangeOfSupplier = 'RSM-001',
  RequestChangeOfSupplier = 'RSM-001',
  ConfirmRequestReallocateChangeOfSupplier = 'RSM-003',
  RejectRequestReallocateChangeOfSupplier = 'RSM-003',
  RequestReallocateChangeOfSupplier = 'RSM-003',
  GenericNotification = 'RSM-004',
  ConfirmRequestEndOfSupply = 'RSM-005',
  RejectRequestEndOfSupply = 'RSM-005',
  RequestEndOfSupply = 'RSM-005',
  RejectRequestAccountingPointCharacteristics = 'RSM-006',
  RequestAccountingPointCharacteristics = 'RSM-006',
  Acknowledgement = 'RSM-009',
  NotifyValidatedMeasuredata = 'RSM-012',
  NotifyAggregatedmeasureData = 'RSM-014',
  RejectRequestValidatedMeasuredata = 'RSM-015',
  RequestValidatedMeasuredata = 'RSM-015',
  RejectRequestAggregatedMeasuredata = 'RSM-016',
  RequestAggregatedMeasuredata = 'RSM-016',
  RejectRequestWholesalesettlement = 'RSM-017',
  RequestWholesalesettlement = 'RSM-017',
  RejectRequestForReminders = 'RSM-018',
  ReminderOfMissingMeasuredata = 'RSM-018',
  RequestForReminders = 'RSM-018',
  Notifywholesaleservices = 'RSM-019',
  ConfirmRequestservice = 'RSM-020',
  RejectRequestservice = 'RSM-020',
  Requestservice = 'RSM-020',
  ConfirmRequestChangeAccountingpointCharacteristics = 'RSM-021',
  RejectRequestChangeAccountingpointCharacteristics = 'RSM-021',
  RequestChangeAccountingpointCharacteristics = 'RSM-021',
  AccountingPointcharacteristics = 'RSM-022',
  ConfirmRequestCancellation = 'RSM-024',
  RejectRequestCancellation = 'RSM-024',
  RequestCancellation = 'RSM-024',
  NotifyCancellation = 'RSM-025',
  ConfirmRequestChangeCustomerCharacteristics = 'RSM-027',
  RejectRequestChangeCustomerCharacteristics = 'RSM-027',
  RequestChangeCustomerCharacteristics = 'RSM-027',
  CharacteristicsOfACustomerAtAnAP = 'RSM-028',
  ConfirmRequestChangeBillingMasterdata = 'RSM-030',
  RejectRequestChangeBillingMasterdata = 'RSM-030',
  RequestChangeBillingMasterdata = 'RSM-030',
  NotifyBillingMasterdata = 'RSM-031',
  RejectRequestBillingMasterdata = 'RSM-032',
  RequestBillingMasterdata = 'RSM-032',
  ConfirmRequestChangeOfPricelist = 'RSM-033',
  RejectRequestChangeOfPricelist = 'RSM-033',
  RequestChangeOfPricelist = 'RSM-033',
  NotifyPricelist = 'RSM-034',
  RejectRequestPricelist = 'RSM-035',
  RequestPricelist = 'RSM-035',
}
