export interface CsvParseResult {
  quality: Quality | null;
  start: Date | null;
  end: Date | null;
  totalSum: number | null; // Sum of all 'Værdi' values
  totalPositions: number | null;
  errors?: CsvError[]
  progress: number; // 0 to 100
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

export type CsvErrorKey = 'CSV_ERROR_DECODE' | 'CSV_ERROR_STRUCTURE' | 'CSV_ERROR_INVALID_VALUE' | 'CSV_ERROR_INVALID_STATUS' | 'CSV_ERROR_EMPTY_POSITION' | 'CSV_ERROR_EMPTY_PERIOD' | 'CSV_ERROR_INCOMPLETE_DAY';
