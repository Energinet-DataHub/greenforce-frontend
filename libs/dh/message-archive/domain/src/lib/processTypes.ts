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

export enum ProcessTypes {
  D02 = 'Preparation for imbalance settlement',
  D03 = 'Temporary',
  D04 = '1st settlement',
  D05 = '2nd settlement',
  D06 = 'Continuous meter reading from profiled metering points',
  D07 = 'Rollback Change-of-supplier',
  D09 = 'Latest available value',
  D10 = 'Meter reading, profiled consumption',
  D11 = 'Incorrect process',
  D12 = 'Cancel meter reading request',
  D13 = 'Change of supply to supplier of last resort',
  D14 = 'Close down metering point',
  D15 = 'Connect meteringpoint',
  D16 = 'Merge of Grids',
  D17 = 'Update masterdata settlement',
  D18 = 'Update charge information',
  D19 = 'Meter Reading',
  D20 = 'Electrical heating',
  D21 = 'Move-in due to other reason ',
  D22 = 'Service request',
  D23 = 'Not used',
  D24 = 'Missing flex meter reading',
  D25 = 'Missing non-profiled time series',
  D26 = 'Missing flex time series',
  D27 = 'Missing profiled reading',
  D28 = 'Proposal contact information',
  D29 = 'Secondary move-in',
  D30 = 'Switch with short notice',
  D31 = 'Transfer metering point',
  D32 = 'Correction settlement',
  D33 = 'Incorrect move',
  D34 = 'End supply due to reallocate',
  D35 = 'Continue supply due to rejected reallocate',
  D36 = 'Continue supply of customer',
  D37 = 'Cancel service request',
  D38 = 'End of supply with short notice',
  D39 = 'Production Obligation',
  D40 = 'Removed parent relation on meteringpoint',
  D41 = 'No disconnection of meteringpoint',
  D43 = 'Historical information about consumption',
  D44 = 'Process cancelled by requesting party',
  D45 = 'Process cancelled by ITX',
  D46 = 'Date of Supplier change caused by End of supply',
  D47 = 'Reminder',
  E01 = 'Move',
  E02 = 'New metering point',
  E03 = 'Change of balance supplier',
  E05 = 'Cancellation',
  E06 = 'Unrequested change of balance supplier',
  E0G = 'Data alignment for master data metering point',
  E20 = 'End of supply',
  E23 = 'Periodic metering',
  E30 = 'Historical data',
  E32 = 'Update master data metering point',
  E34 = 'Update master data consumer',
  E53 = 'Meter reading on demand',
  E56 = 'Change of Balance Responsible Party',
  E65 = 'Customer move-in',
  E66 = 'Customer move-out',
  E67 = 'Placement of Meter ',
  E75 = 'Change of metering method',
  E79 = 'Change Connection Status',
  E80 = 'Change of estimated annual volume',
  E84 = 'Update master data meter',
}
