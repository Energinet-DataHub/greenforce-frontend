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

export enum BusinessReasonCodes
{
  ConnectMeteringPoint = "D15",
  DisconnectReconnectMeteringPoint = "E79",
  StartDateValidation = "E17",
  ChangingTariffTaxValueNotAllowed = "D14",
  SenderIsMandatoryTypeValidation = "D02",
  RecipientIsMandatoryTypeValidation = "D02",
  ChargeOperationIdRequired = "E0H",
  ChargeIdLengthValidation = "E86",
  ChargeIdRequiredValidation = "E0H",
  DocumentTypeMustBeRequestUpdateChargeInformation = "D02",
  BusinessReasonCodeMustBeUpdateChargeInformation = "D02",
  ChargeTypeIsKnownValidation = "E86",
  VatClassificationValidation = "E86",
  ResolutionTariffValidation = "D23",
  ResolutionFeeValidation = "D23",
  ResolutionSubscriptionValidation = "D23",
  StartDateTimeRequiredValidation = "E0H",
  ChargeOwnerIsRequiredValidation = "E0H",
  ChargeNameHasMaximumLength = "E86",
  ChargeDescriptionHasMaximumLength = "E86",
  ChargeTypeTariffPriceCount = "E87",
  MaximumPrice = "E90",
  ChargePriceMaximumDigitsAndDecimals = "E86",
  FeeMustHaveSinglePrice = "E87",
  SubscriptionMustHaveSinglePrice = "E87",
  CommandSenderMustBeAnExistingMarketParticipant = "D02",
  ChargeUpdateNotYetSupported = "D13",
  MeteringPointDoesNotExist = "E10",
  ChargeDoesNotExist = "E0I",
  ChargeLinkUpdateNotYetSupported = "D13",
  StopChargeNotYetSupported = "D13",
}
