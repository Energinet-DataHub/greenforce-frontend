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

/**
 * Number of leading bytes inspected to detect the encoding. The encoding signal (Danish
 * characters in the header and first rows) appears near the start of these CSVs, so a bounded
 * prefix is enough and we avoid loading a large upload fully into memory.
 */
export const SAMPLE_BYTES = 64 * 1024;

/**
 * Detect a text file's encoding so it can be decoded correctly (fx. when streaming an
 * uploaded CSV). Danish business files are exported either as UTF-8 (often with a BOM) or,
 * when re-saved from Excel on a Danish Windows machine, as the ANSI code page Windows-1252
 * (a superset of ISO-8859-1). UTF-8 is self-validating, so try a strict decode first and
 * fall back to Windows-1252.
 *
 * Only the first `SAMPLE_BYTES` are read via `File.slice`, so a multi-gigabyte upload is not
 * pulled into memory just to pick an encoding.
 *
 * Statistical detection (e.g. chardet) is deliberately avoided: it mis-detects short
 * Latin-1 files as Shift_JIS, which mangles Danish characters such as "æ", "ø" and "å".
 *
 * @returns an encoding label suitable for `TextDecoder` / `FileReader.readAsText`.
 */
export const detectEncoding = async (file: File): Promise<'utf-8' | 'windows-1252'> => {
  const sample = new Uint8Array(await file.slice(0, SAMPLE_BYTES).arrayBuffer());
  if (sample[0] === 0xef && sample[1] === 0xbb && sample[2] === 0xbf) return 'utf-8'; // BOM
  try {
    // `stream: true` tolerates a multi-byte character cut off at the sample boundary (the
    // trailing bytes are buffered, not flushed), while still throwing on genuinely invalid
    // bytes such as a lone Windows-1252 "å" (0xE5) followed by ASCII.
    new TextDecoder('utf-8', { fatal: true }).decode(sample, { stream: true });
    return 'utf-8';
  } catch {
    return 'windows-1252';
  }
};
