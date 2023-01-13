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
import { Component, Input } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { WattCardModule } from '@energinet-datahub/watt/card';
import { UserRoleDto } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-role-master-data',
  standalone: true,
  templateUrl: './dh-role-master-data.component.html',
  styles: [
    `
      .master-data-list {
        padding: 0;
        margin: 0;

        ul {
          list-style: none;
        }

        li {
          display: grid;
          margin-top: var(--watt-space-m);
          grid-template-columns: 20% 1fr;
        }

        li:not(:last-child) {
          border-bottom: 1px solid var(--watt-color-neutral-grey-300);
        }
      }
    `,
  ],
  imports: [WattCardModule, TranslocoModule],
})
export class DhRoleMasterDataComponent {
  @Input() role: UserRoleDto | null = null;
}
