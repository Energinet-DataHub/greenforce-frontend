import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { eovApiEnvironmentToken } from '@energinet-datahub/eov/shared/environments';
import { Translation, TranslocoLoader } from '@ngneat/transloco';
import { Observable } from 'rxjs';

@Injectable()
export class EovTranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);
  #apiBase = inject(eovApiEnvironmentToken).customerApiUrl;
  getTranslation(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`${this.#apiBase}/api/translation/get/${lang}`);
  }
}
