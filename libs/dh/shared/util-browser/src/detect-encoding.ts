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
 * Detect a text file's encoding so it can be decoded correctly (fx. when streaming an
 * uploaded CSV). Danish business files are exported either as UTF-8 (often with a BOM) or,
 * when re-saved from Excel on a Danish Windows machine, as the ANSI code page Windows-1252
 * (a superset of ISO-8859-1). UTF-8 is self-validating, so try a strict decode first and
 * fall back to Windows-1252.
 *
 * Statistical detection (e.g. chardet) is deliberately avoided: it mis-detects short
 * Latin-1 files as Shift_JIS, which mangles Danish characters such as "æ", "ø" and "å".
 *
 * @returns an encoding label suitable for `TextDecoder` / `FileReader.readAsText`.
 */
export const detectEncoding = async (file: File): Promise<'utf-8' | 'windows-1252'> => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) return 'utf-8'; // BOM
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return 'utf-8';
  } catch {
    return 'windows-1252';
  }
};
