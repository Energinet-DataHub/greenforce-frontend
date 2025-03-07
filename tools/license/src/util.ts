import { readFile } from 'fs';

export const readFileAsync = (file: string) =>
  new Promise<string>((resolve, reject) =>
    readFile(file, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    })
  );
