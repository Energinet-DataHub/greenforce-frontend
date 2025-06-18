import * as Papa from 'papaparse';
import { validateRequiredColumns } from './validations';

/**
 * Factory function to create a PapaParse config for parsing measurement CSV files using chunked processing.
 */
export function createPapaParseConfigFactory(
  addError: (rowNum: number, message: string) => void,
  onComplete: () => void,
  setHeadersValidated: () => void,
  getHeadersValidated: () => boolean,
  validateAndProcessRows?: (rows: Record<string, string>[], cursor?: number) => void
): Papa.ParseConfig<Record<string, string>> {
  const validateHeaders = (headers: string[]): boolean => {
    const missingColumns = validateRequiredColumns(headers);
    if (missingColumns.length > 0) {
      addError(0, `Missing required columns: ${missingColumns.join(', ')}`);
      return false;
    }
    return true;
  };
  let cursor = 0;
  // PapaParse types may not include 'chunk', but it is supported at runtime. Cast to 'any' to allow chunk property.
  const config = {
    header: true,
    skipEmptyLines: true,
    worker: true,
    chunk: (results: Papa.ParseResult<Record<string, string>>, parser: Papa.Parser) => {
      const { data, errors, meta } = results;
      errors.forEach((e: Papa.ParseError) => {
        const rowNum = e.row ?? Math.floor(meta.cursor ?? -1);
        addError(rowNum, e.message);
      });
      if (meta.fields && !getHeadersValidated()) {
        setHeadersValidated();
        if (!validateHeaders(meta.fields)) {
          parser.abort();
          return;
        }
      }
      if (validateAndProcessRows) {
        validateAndProcessRows(data, cursor);
        cursor += data.length;
      }
    },
    complete: onComplete,
  };
  return config as any;
}
