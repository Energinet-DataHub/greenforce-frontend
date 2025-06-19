import * as Encoding from 'encoding-japanese';
import * as jschardet from 'jschardet';

/**
 * Reads and decodes a File as an ArrayBuffer, returning a decoded string and optional warning.
 */
export async function decodeFile(file: File): Promise<{ decodedString: string; encodingWarning?: { row: number; message: string } }> {
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
function decodeArrayBuffer(arrayBuffer: ArrayBuffer): { decodedString: string; encodingWarning?: { row: number; message: string } } {
  let decodedString: string;
  const uint8Array = new Uint8Array(arrayBuffer);
  const encodingSample = Encoding.codeToString(uint8Array.slice(0, 1000));
  const detected = jschardet.detect(encodingSample);
  let encoding = detected.encoding ? detected.encoding.toLowerCase() : 'utf-8';
  if (encoding === 'ascii') encoding = 'utf-8';
  if (encoding !== 'utf-8') {
    decodedString = Encoding.convert(uint8Array, {
      to: 'UNICODE',
      from: mapToEncodingJapaneseName(encoding),
      type: 'string',
    }) as string;
    return {
      decodedString,
      encodingWarning: { row: 0, message: `Warning: Detected file encoding is ${encoding}. Decoded automatically.` },
    };
  } else {
    decodedString = new TextDecoder('utf-8').decode(uint8Array);
    return { decodedString };
  }
}