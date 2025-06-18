import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import * as Papa from 'papaparse';
import { decodeFile } from './encoding';
import { parseFlexibleDate, findIntervalMinutes, groupRowsByDay } from './date-utils';

import {
  isNumeric,
  VALID_KVANTUM_STATUS,
  validateKvantumStatus,
  isMeasurementsCSV,
  KVANTUM_STATUS,
  validateDayCompleteness,
} from './validations';
import { CsvParseResult, MeasurementsCSV } from './types';
import { createPapaParseConfigFactory } from './papaparse-config-factory';

@Injectable({ providedIn: 'root' })
export class CsvParseService {
  parseFile(file: File): Observable<CsvParseResult> {
    return new Observable<CsvParseResult>((observer) => {
      const validRows: MeasurementsCSV[] = [];
      let headersValidated = false;
      let errorEmitted = false;

      const setHeadersValidated = () => { headersValidated = true; };

      const onError = this.handleParseError.bind(this, observer, () => { errorEmitted = true; }, () => errorEmitted);
      const validateAndProcessRows = this.handleValidateAndProcessRows.bind(this, validRows, onError);
      const onParseComplete = this.handleParseComplete.bind(this, observer, validRows, () => errorEmitted);

      const papaConfig = createPapaParseConfigFactory(
        () => { /* no-op: error handling is now inline */ },
        onParseComplete,
        setHeadersValidated,
        () => headersValidated,
        (rows: Record<string, string>[], cursor?: number, parser?: Papa.Parser) => validateAndProcessRows(rows, cursor, parser)
      );

      decodeFile(file)
        .then(({ decodedString, encodingWarning }: { decodedString: string; encodingWarning?: { row: number; message: string } }) => {
          if (encodingWarning) onError(encodingWarning);
          Papa.parse<Record<string, string>>(decodedString, papaConfig);
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          onError({ row: 0, message });
        });
    });
  }

  private handleParseError(
    observer: Observer<CsvParseResult>,
    setErrorEmitted: () => void,
    getErrorEmitted: () => boolean,
    error: { row: number; message: string }
  ) {
    if (!getErrorEmitted()) {
      observer.next({ startTime: null, invalidRows: [error], totalSum: 0 });
      observer.complete();
      setErrorEmitted();
    }
  }

  private handleValidateAndProcessRows(
    validRows: MeasurementsCSV[],
    onError: (error: { row: number; message: string }) => void,
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
    onError: (error: { row: number; message: string }) => void,
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

  private isRowStructureValid(row: Record<string, string>, rowIndex: number, onError: (error: { row: number; message: string }) => void, parser?: Papa.Parser): boolean {
    if (!isMeasurementsCSV(row)) {
      onError({ row: rowIndex, message: `Row does not match expected CSV structure` });
      if (parser) parser.abort();
      return false;
    }
    return true;
  }

  private isValueValid(row: Record<string, string>, rowIndex: number, onError: (error: { row: number; message: string }) => void, parser?: Papa.Parser): boolean {
    if (isNumeric(row['Værdi'])) {
      onError({ row: rowIndex, message: `Invalid 'Værdi': ${row['Værdi']} at 'Position' ${row['Position']}` });
      if (parser) parser.abort();
      return false;
    }
    return true;
  }

  private isKvantumStatusValid(row: Record<string, string>, rowIndex: number, onError: (error: { row: number; message: string }) => void, parser?: Papa.Parser): boolean {
    if (!validateKvantumStatus(row[KVANTUM_STATUS])) {
      onError({ row: rowIndex, message: `Invalid 'Kvantum status': '${row[KVANTUM_STATUS]}' at 'Position' ${row['Position']}. Valid values are: ${VALID_KVANTUM_STATUS.join(', ')}` });
      if (parser) parser.abort();
      return false;
    }
    return true;
  }

  private isPositionValid(row: Record<string, string>, rowIndex: number, onError: (error: { row: number; message: string }) => void, parser?: Papa.Parser): boolean {
    const position = row['Position'];
    if (position === undefined || (position.includes(' ') ? !position.trim() : !position)) {
      onError({ row: rowIndex, message: `Empty 'Position' field` });
      if (parser) parser.abort();
      return false;
    }
    return true;
  }

  private isPeriodeValid(row: Record<string, string>, rowIndex: number, onError: (error: { row: number; message: string }) => void, parser?: Papa.Parser): boolean {
    const periode = row['Periode'];
    if (periode === undefined || (periode.includes(' ') ? !periode.trim() : !periode)) {
      onError({ row: rowIndex, message: `Empty 'Periode' field` });
      if (parser) parser.abort();
      return false;
    }
    return true;
  }

  private handleParseComplete(
    observer: Observer<CsvParseResult>,
    validRows: MeasurementsCSV[],
    getErrorEmitted: () => boolean
  ) {
    if (getErrorEmitted()) return;
    const invalidRows: { row: number; message: string }[] = [];
    this.analyzeIntervalsAndCompleteness(validRows, invalidRows);
    const startTime = parseFlexibleDate(validRows[0]?.Periode) ?? null;
    const totalSum = validRows.reduce((sum, row) => {
      const value = row.Værdi;
      const numericValue = value.includes(',') ? parseFloat(value.replace(',', '.')) : parseFloat(value);
      return sum + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);
    observer.next({
      startTime,
      invalidRows,
      totalSum: invalidRows.length ? 0 : totalSum,
    });
    observer.complete();
  }

  private analyzeIntervalsAndCompleteness(validRows: MeasurementsCSV[], invalidRows: { row: number; message: string }[]) {
    const dayMap = groupRowsByDay(validRows);
    const intervalMinutes = findIntervalMinutes(dayMap);
    const dayCompleteness = validateDayCompleteness(dayMap, intervalMinutes, invalidRows);
    return { intervalMinutes, dayCompleteness };
  }
}