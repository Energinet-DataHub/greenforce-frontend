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
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import * as Papa from 'papaparse';
import { decodeFile } from './encoding';
import { parseFlexibleDate, findIntervalMinutes, groupRowsByDay } from './date-utils';

import {
  isNumeric,
  validateKvantumStatus,
  isMeasurementsCSV,
  KVANTUM_STATUS,
  validateDayCompleteness,
} from './validations';
import { CsvError, CsvParseResult, MeasurementsCSV, Quality } from './types';

@Injectable({ providedIn: 'root' })
export class CsvParseService {
  parseFile(file: File): Observable<CsvParseResult> {
    return new Observable<CsvParseResult>((observer) => {
      const validRows: MeasurementsCSV[] = [];
      let cursor = 0;
      let errorEmitted = false;

      const onError = this.handleParseError.bind(
        this,
        observer,
        () => {
          errorEmitted = true;
        },
        () => errorEmitted
      );
      const validateAndProcessRows = this.handleValidateAndProcessRows.bind(
        this,
        validRows,
        onError
      );
      const onParseComplete = () =>
        this.handleParseComplete(observer, validRows, () => errorEmitted);

      decodeFile(file)
        .then(
          ({
            decodedString,
          }: {
            decodedString: string;
            encodingWarning?: { row: number; message: string };
          }) => {
            Papa.parse<Record<string, string>>(decodedString, {
              header: true,
              skipEmptyLines: true,
              worker: true,
              chunkSize: 30_000,
              chunk: (results: Papa.ParseResult<Record<string, string>>) => {
                const { data, meta } = results;
                if (validateAndProcessRows) {
                  validateAndProcessRows(data, cursor);
                  cursor += data.length;
                }
                if (meta && typeof meta.cursor === 'number' && file.size) {
                  observer.next({
                    quality: null,
                    start: null,
                    end: null,
                    totalSum: null,
                    totalPositions: null,
                    errors: undefined,
                    progress: Math.round(Math.min(meta.cursor / file.size, 1) * 100),
                  });
                }
              },
              complete: onParseComplete,
            });
          }
        )
        .catch(() => {
          onError({ key: 'CSV_ERROR_DECODE' });
        });
    });
  }

  private handleParseError(
    observer: Observer<CsvParseResult>,
    setErrorEmitted: () => void,
    getErrorEmitted: () => boolean,
    error: CsvError
  ) {
    if (!getErrorEmitted()) {
      observer.next({
        quality: null,
        start: null,
        end: null,
        errors: [error],
        totalSum: null,
        totalPositions: null,
        progress: 100,
      });
      observer.complete();
      setErrorEmitted();
    }
  }

  private handleValidateAndProcessRows(
    validRows: MeasurementsCSV[],
    onError: (error: CsvError) => void,
    rows: Record<string, string>[],
    cursor = 0,
    parser?: Papa.Parser
  ): boolean {
    for (let idx = 0; idx < rows.length; idx++) {
      const row = rows[idx];
      const rowIndex = cursor + idx + 1;
      if (!this.validateAndPushRow(row, rowIndex, validRows, onError, parser)) return false;
    }
    return true;
  }

  private validateAndPushRow(
    row: Record<string, string>,
    rowIndex: number,
    validRows: MeasurementsCSV[],
    onError: (error: CsvError) => void,
    parser?: Papa.Parser
  ): boolean {
    if (!this.isRowStructureValid(row, rowIndex, onError, parser)) return false;
    if (!this.isValueValid(row, rowIndex, onError, parser)) return false;
    if (!this.isKvantumStatusValid(row, rowIndex, onError, parser)) return false;
    if (!this.isPositionValid(row, rowIndex, onError, parser)) return false;
    if (!this.isPeriodeValid(row, rowIndex, onError, parser)) return false;
    validRows.push(row as MeasurementsCSV);
    return true;
  }

  private isRowStructureValid(
    row: Record<string, string>,
    rowIndex: number,
    onError: (error: CsvError) => void,
    parser?: Papa.Parser
  ): boolean {
    if (!isMeasurementsCSV(row)) {
      onError({ key: 'CSV_ERROR_STRUCTURE', row: rowIndex });
      if (parser) parser.abort();
      return false;
    }
    return true;
  }

  private isValueValid(
    row: Record<string, string>,
    rowIndex: number,
    onError: (error: CsvError) => void,
    parser?: Papa.Parser
  ): boolean {
    if (isNumeric(row['Værdi'])) {
      onError({ key: 'CSV_ERROR_INVALID_VALUE', row: rowIndex });
      if (parser) parser.abort();
      return false;
    }
    return true;
  }

  private isKvantumStatusValid(
    row: Record<string, string>,
    rowIndex: number,
    onError: (error: CsvError) => void,
    parser?: Papa.Parser
  ): boolean {
    if (!validateKvantumStatus(row[KVANTUM_STATUS])) {
      onError({ key: 'CSV_ERROR_INVALID_STATUS', row: rowIndex });
      if (parser) parser.abort();
      return false;
    }
    return true;
  }

  private isPositionValid(
    row: Record<string, string>,
    rowIndex: number,
    onError: (error: CsvError) => void,
    parser?: Papa.Parser
  ): boolean {
    const position = row['Position'];
    if (position === undefined || (position.includes(' ') ? !position.trim() : !position)) {
      onError({ key: 'CSV_ERROR_EMPTY_POSITION', row: rowIndex });
      if (parser) parser.abort();
      return false;
    }
    return true;
  }

  private isPeriodeValid(
    row: Record<string, string>,
    rowIndex: number,
    onError: (error: CsvError) => void,
    parser?: Papa.Parser
  ): boolean {
    const periode = row['Periode'];
    if (periode === undefined || (periode.includes(' ') ? !periode.trim() : !periode)) {
      onError({ key: 'CSV_ERROR_EMPTY_PERIOD', row: rowIndex });
      if (parser) parser.abort();
      return false;
    }
    return true;
  }

  private isA04Status(status: string | undefined): boolean {
    return status === 'a04' || status === 'målt';
  }

  private isA03Status(status: string | undefined): boolean {
    return status === 'a03' || status === 'estimeret';
  }

  private getQualityFromStatuses(validRows: MeasurementsCSV[]): Quality | null {
    let hasA04 = false;
    let hasA03 = false;

    for (const row of validRows) {
      const status = row['Kvantum status']?.toLowerCase();
      if (this.isA04Status(status)) {
        hasA04 = true;
      } else if (this.isA03Status(status)) {
        hasA03 = true;
      }
      if (hasA04 && hasA03) return 'MIXED';
    }

    if (hasA04) return 'A04';
    if (hasA03) return 'A03';
    return null;
  }

  private handleParseComplete(
    observer: Observer<CsvParseResult>,
    validRows: MeasurementsCSV[],
    getErrorEmitted: () => boolean
  ) {
    const errors = [];
    if (getErrorEmitted()) return;
    const incompleteDays = this.analyzeIntervalsAndCompleteness(validRows);
    if (incompleteDays) {
      errors.push(incompleteDays);
    }

    const start = parseFlexibleDate(validRows[0]?.Periode) ?? null;
    const end = parseFlexibleDate(validRows[validRows.length - 1]?.Periode) ?? null;

    const totalSum = validRows.reduce((sum, row) => {
      const value = row.Værdi;
      const numericValue = value.includes(',')
        ? parseFloat(value.replace(',', '.'))
        : parseFloat(value);
      return sum + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);

    const quality = this.getQualityFromStatuses(validRows);

    observer.next({
      quality,
      start,
      end,
      totalSum,
      totalPositions: validRows.length,
      errors,
      progress: 100,
    });
    observer.complete();
  }

  private analyzeIntervalsAndCompleteness(validRows: MeasurementsCSV[]): CsvError | undefined {
    const dayMap = groupRowsByDay(validRows);
    const intervalMinutes = findIntervalMinutes(dayMap);
    return validateDayCompleteness(dayMap, intervalMinutes);
  }
}
