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
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { EoScrollViewComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [EoScrollViewComponent, AsyncPipe, NgIf, WattEmptyStateComponent],
  selector: 'eo-privacy-policy',
  styles: [
    `
      :host {
        display: block;
      }

      :host ::ng-deep {
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
  template: `
    <ng-container *ngIf="policy; else fallback">
      <div [innerHTML]="policy"></div>
    </ng-container>

    <ng-template #fallback>
      <watt-empty-state
        icon="danger"
        title="Oops, we could not load the privacy policy!"
        message="Please ensure that you have no browser extensions blocking the privacy policy enabled. Try turning off possible ad blockers and reloading the page."
      />
    </ng-template>
  `,
})
export class EoPrivacyPolicyComponent {
  @Input() policy!: string | null;
  @Input() hasError = false;
}
