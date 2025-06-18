export interface CsvParseResult {
  startTime: string | null;
  invalidRows: { row: number; message: string }[];
  totalSum: number | null; // Sum of all 'Værdi' values
  error?: string;
}

// Type for a row in the measurements CSV
export interface MeasurementsCSV extends Record<string, string> {
  Position: string;
  Periode: string;
  Værdi: string;
  'Kvantum status': string;
}
