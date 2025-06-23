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
export interface CsvParseResult {
  quality: Quality | null;
  start: Date | null;
  end: Date | null;
  totalSum: number | null; // Sum of all 'Værdi' values
  totalPositions: number | null;
  errors?: CsvError[];
  progress: number; // 0 to 100
  measurements: MeasurementsCSV[];
}

// Type for a row in the measurements CSV
export interface MeasurementsCSV extends Record<string, string> {
  Position: string;
  Periode: string;
  Værdi: string;
  'Kvantum status': string;
}

export type Quality = 'A04' | 'A03' | 'MIXED';
export interface CsvError {
  key: CsvErrorKey;
  row?: number;
}

export type CsvErrorKey =
  | 'CSV_ERROR_DECODE'
  | 'CSV_ERROR_STRUCTURE'
  | 'CSV_ERROR_INVALID_VALUE'
  | 'CSV_ERROR_INVALID_STATUS'
  | 'CSV_ERROR_EMPTY_POSITION'
  | 'CSV_ERROR_EMPTY_PERIOD'
  | 'CSV_ERROR_INCOMPLETE_DAY';
