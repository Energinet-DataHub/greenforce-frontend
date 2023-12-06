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
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

import { EoCertificate } from '@energinet-datahub/eo/certificates/domain';
import { EoCertificatesService } from './eo-certificates.service';

interface EoCertificatesState {
  hasLoaded: boolean;
  certificates: EoCertificate[];
  error: HttpErrorResponse | null;
}

@Injectable({
  providedIn: 'root',
})
export class EoCertificatesStore extends ComponentStore<EoCertificatesState> {
  readonly hasLoaded$ = this.select((state) => state.hasLoaded);
  readonly certificates$ = this.select((state) => state.certificates);
  readonly error$ = this.select((state) => state.error);

  readonly setHasLoaded = this.updater(
    (state, hasLoaded: boolean): EoCertificatesState => ({ ...state, hasLoaded })
  );
  readonly setCertificates = this.updater(
    (state, certificates: EoCertificate[]): EoCertificatesState => ({ ...state, certificates })
  );
  readonly setError = this.updater(
    (state, error: HttpErrorResponse | null): EoCertificatesState => ({ ...state, error })
  );

  constructor(private service: EoCertificatesService) {
    super({
      hasLoaded: false,
      certificates: [],
      error: null,
    });

    this.loadData();
  }

  loadData() {
    this.service.getCertificates().subscribe({
      next: (response) => {
        const adjustedToDateInMilliseconds = response?.result?.map((cert) => ({
          ...cert,
          start: cert.start * 1000,
          end: cert.end * 1000,
        }));
        this.setCertificates(adjustedToDateInMilliseconds);
        this.setError(null);
        this.setHasLoaded(true);
      },
      error: (error) => {
        this.setError(error);
        this.setHasLoaded(true);
      },
    });
  }
}
