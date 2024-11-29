import { Observable } from 'rxjs';

interface Options {
  /** The name of the file. */
  name: string;
  /** The MIME type of the file. */
  type: string;
}

/** Streams data to a file for downloading. */
export const streamToFile =
  ({ name, type }: Options) =>
  (data: unknown): Observable<void> =>
    new Observable((observer) => {
      const blobPart = data as BlobPart;
      const blob = new Blob([blobPart], { type });
      const basisData = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = basisData;
      link.download = name;
      link.click();
      link.remove();
      observer.next();
      observer.complete();
    });
