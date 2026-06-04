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
import { detectEncoding } from '../src/detect-encoding';

const sample = 'Position,Periode,Værdi,Kvantum status\r\n1,28.4.2025 0.00,8,Målt\r\n';

const fileFrom = (bytes: Uint8Array) => new File([bytes], 'sample.csv', { type: 'text/csv' });

/**
 * Latin-1 / Windows-1252 bytes: every code point used here is below 0x100, so its UTF-16
 * code unit equals its single ANSI byte (fx. "å" U+00E5 becomes byte 0xE5). This mirrors a
 * CSV re-saved from Excel on a Danish Windows machine.
 */
const latin1Bytes = (text: string) => Uint8Array.from(text, (char) => char.charCodeAt(0));

describe(detectEncoding, () => {
  // Regression: statistical detection (chardet) mis-detected short Latin-1 files as
  // Shift_JIS, mangling "Værdi"/"Målt" so CSV uploads failed.
  it('detects a Windows-1252 (ANSI) file exported from Excel', async () => {
    expect(await detectEncoding(fileFrom(latin1Bytes(sample)))).toBe('windows-1252');
  });

  it('detects a UTF-8 file', async () => {
    expect(await detectEncoding(fileFrom(new TextEncoder().encode(sample)))).toBe('utf-8');
  });

  it('detects a UTF-8 file with a byte order mark', async () => {
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const bytes = new Uint8Array([...bom, ...new TextEncoder().encode(sample)]);
    expect(await detectEncoding(fileFrom(bytes))).toBe('utf-8');
  });
});
