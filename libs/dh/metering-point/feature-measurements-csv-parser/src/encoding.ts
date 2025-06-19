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
import * as Encoding from 'encoding-japanese';
import chardet from 'chardet';

/**
 * Reads and decodes a File as an ArrayBuffer, returning a decoded string and optional warning.
 */
export async function decodeFile(
  file: File
): Promise<{ decodedString: string; encodingWarning?: { row: number; message: string } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result;
      if (!(arrayBuffer instanceof ArrayBuffer)) {
        reject(new Error('Failed to read file as ArrayBuffer'));
        return;
      }
      try {
        const { decodedString, encodingWarning } = decodeArrayBuffer(arrayBuffer);
        resolve({ decodedString, encodingWarning });
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        reject(new Error(message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Maps detected encoding names to encoding-japanese's expected values.
 */
function mapToEncodingJapaneseName(enc: string): Encoding.Encoding {
  switch (enc.toLowerCase()) {
    case 'utf-8':
    case 'utf8':
    case 'ascii':
      return 'UTF8';
    case 'windows-1252':
    case 'iso-8859-1':
    case 'latin1':
      return 'AUTO'; // Use AUTO for Western encodings
    case 'shift_jis':
    case 'sjis':
      return 'SJIS';
    case 'euc-jp':
      return 'EUCJP';
    case 'jis':
      return 'JIS';
    case 'unicode':
      return 'UNICODE';
    default:
      return 'UTF8'; // fallback
  }
}

/**
 * Decodes an ArrayBuffer to a string, attempting to detect and handle encoding.
 */
function decodeArrayBuffer(arrayBuffer: ArrayBuffer): {
  decodedString: string;
  encodingWarning?: { row: number; message: string };
} {
  let decodedString: string;
  const uint8Array = new Uint8Array(arrayBuffer);
  const encodingSample = Encoding.codeToString(uint8Array.slice(0, 1000));
  let encoding = chardet.detect(new TextEncoder().encode(encodingSample))?.toLowerCase() || 'utf-8';
  if (encoding === 'ascii') encoding = 'utf-8';
  if (encoding !== 'utf-8') {
    decodedString = Encoding.convert(uint8Array, {
      to: 'UNICODE',
      from: mapToEncodingJapaneseName(encoding),
      type: 'string',
    }) as string;
    return {
      decodedString,
      encodingWarning: {
        row: 0,
        message: `Warning: Detected file encoding is ${encoding}. Decoded automatically.`,
      },
    };
  } else {
    decodedString = new TextDecoder('utf-8').decode(uint8Array);
    return { decodedString };
  }
}
