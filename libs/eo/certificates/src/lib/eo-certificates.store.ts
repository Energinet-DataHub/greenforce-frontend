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
import {
  EoCertificate,
  EoCertificatesService,
} from './eo-certificates.service';

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
  readonly setHasLoaded = this.updater(
    (state, hasLoaded: boolean): EoCertificatesState => ({
      ...state,
      hasLoaded: hasLoaded,
    })
  );

  readonly certificates$ = this.select((state) => state.certificates);
  readonly setCertificates = this.updater(
    (state, certificates: EoCertificate[]): EoCertificatesState => ({
      ...state,
      certificates,
    })
  );

  readonly error$ = this.select((state) => state.error);
  readonly setError = this.updater(
    (state, error: HttpErrorResponse | null): EoCertificatesState => ({
      ...state,
      error,
    })
  );

  mockData = [
    {
      id: '3b2fcf2f-0e39-4622-9371-05c5a37147c8',
      dateFrom: 1668606049000,
      dateTo: 1668609649000,
      quantity: 17,
      gsrn: '112233445566778899',
      gridArea: 'DK1',
      techCode: 'T010000',
      fuelCode: 'F00000000',
    },
    {
      id: 'e3b35527-890e-4249-8105-dba4f2f9335a',
      dateFrom: 1668606039000,
      dateTo: 1668609639000,
      quantity: 38,
      gsrn: '112233445566778899',
      gridArea: 'DK1',
      techCode: 'T010000',
      fuelCode: 'F00000000',
    },
    {
      id: '20bdf409-f4ae-428b-8b62-f2bc756f7cc0',
      dateFrom: 1668606029000,
      dateTo: 1668609629000,
      quantity: 22,
      gsrn: '112233445566778899',
      gridArea: 'DK1',
      techCode: 'T010000',
      fuelCode: 'F00000000',
    },
  ];

  constructor(private service: EoCertificatesService) {
    super({
      hasLoaded: false,
      certificates: [],
      error: null,
    });

    this.loadData();
  }

  loadMockData() {
    this.setCertificates(this.mockData);
  }

  loadData() {
    this.service.getCertificates().subscribe({
      next: (response) => {
        const adjustedToDateInMilliseconds = response?.result?.map((cert) => ({
          ...cert,
          dateTo: cert.dateTo * 1000,
          dateFrom: cert.dateFrom * 1000,
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
