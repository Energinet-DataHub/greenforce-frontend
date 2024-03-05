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

import { DestroyRef, Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

import { EoCertificateDetailsComponent } from '@energinet-datahub/eo/certificates/feature-details';
import { EoCertificatesOverviewComponent } from '@energinet-datahub/eo/certificates/feature-overview';
import { EoCertificatesService } from '@energinet-datahub/eo/certificates/data-access-api';
import { EoCertificate } from '@energinet-datahub/eo/certificates/domain';
import { translations } from '@energinet-datahub/eo/translations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class CertificateDetailsTitleResolver {
  private certificatesService: EoCertificatesService = inject(EoCertificatesService);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);
  private translations = translations;

  resolve(route: ActivatedRouteSnapshot) {
    return this.transloco.selectTranslation().pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(() => {
        return this.certificatesService.getCertificates();
      }),
      map((certs: EoCertificate[]) =>
        certs.find((item) => item.federatedStreamId.streamId === route.params['id'])
      ),
      map((cert) => {
        return this.transloco.translate(this.translations.certificateDetails.title, {
          certificateType:
            cert?.certificateType === 'production'
              ? this.capitalizeFirstLetter(this.transloco.translate(this.translations.certificates.productionType))
              : this.capitalizeFirstLetter(this.transloco.translate(this.translations.certificates.consumptionType)),
        });
      })
    );
  }

  capitalizeFirstLetter(string?: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

export const eoCertificatesRoutes: Routes = [
  {
    path: '',
    title: translations.certificates.title,
    component: EoCertificatesOverviewComponent,
  },
  {
    path: ':id',
    title: CertificateDetailsTitleResolver,
    component: EoCertificateDetailsComponent,
  },
];
