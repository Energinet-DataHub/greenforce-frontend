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
import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EoScrollViewComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { EoTermsService } from '@energinet-datahub/eo/shared/services';

interface VersionResponse {
  version: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [EoScrollViewComponent, AsyncPipe],
  selector: 'eo-privacy-policy',
  styles: [
    `
      :host {
        display: block;
      }

      small {
        color: var(--watt-color-neutral-grey-700);
      }

      .policy ::ng-deep {
        h2 {
          margin-bottom: 16px;
        }

        h3 {
          margin-top: 16px;
        }

        p {
          margin-bottom: 16px;
        }

        ol {
          margin: 8px 0;
          padding-left: 32px;

          strong {
            color: var(--watt-typography-headline-color);
          }
        }

        ul {
          margin: 8px 0;
          padding-left: 16px;
        }

        li {
          --circle-size: 8px;
        }

        table {
          font-size: 14px;
          margin: 32px 0;
          border: 1px solid black;

          th {
            background-color: var(--watt-color-primary-light);
            color: var(--watt-typography-label-color);
            text-align: left;
          }

          td {
            vertical-align: top;
            border: 1px solid rgba(0, 0, 0, 0.12); //Magic UX color for now
            padding: 4px;
          }
        }
      }
    `,
  ],
  template: ` <div class="policy" [innerHTML]="privacyPolicy$ | async"></div> `,
})
export class EoPrivacyPolicyComponent {
  privacyPolicy$ = this.http.get('/assets/html/privacy-policy.html', { responseType: 'text' });
  bag$ = this.http.get<VersionResponse>('/assets/configuration/privacy-policy.json').subscribe({
    next: (response) => {
      this.termsService.setVersion(response.version);
    },
    error: () => {
      this.termsService.setVersion(-1);
    },
  });

  constructor(private http: HttpClient, private termsService: EoTermsService) {}
}
