import { HttpClient } from '@angular/common/http';
import { ClassProvider, Injectable } from '@angular/core';
import {
  Translation,
  TRANSLOCO_LOADER,
  TranslocoLoader,
} from '@ngneat/transloco';
import { Observable } from 'rxjs';

@Injectable()
export class DhTranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

export const dhTranslocoHttpLoaderProvider: ClassProvider = {
  provide: TRANSLOCO_LOADER,
  useClass: DhTranslocoHttpLoader,
};
