//#region License
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
//#endregion
import { httpResource } from '@angular/common/http';
import { Component, inject, input, computed } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattCodeComponent } from '@energinet-datahub/watt/code';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetBalanceResponsibleByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { VaterFlexComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

@Component({
  selector: 'dh-balance-responsible-drawer',
  templateUrl: './dh-drawer.component.html',
  styles: [
    `
      :host {
        display: block;

        watt-code {
          padding: var(--watt-space-ml);
        }
      }

      .message-heading {
        margin: 0;
        margin-bottom: var(--watt-space-s);
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    WATT_DRAWER,
    WattSpinnerComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattDatePipe,
    WattCodeComponent,
    DhEmDashFallbackPipe,
    VaterFlexComponent,
    VaterUtilityDirective,
  ],
})
export class DhBalanceResponsibleDrawerComponent {
  navigation = inject(DhNavigationService);
  // Param value
  id = input.required<string>();
  query = query(GetBalanceResponsibleByIdDocument, () => ({
    variables: { documentId: this.id() },
  }));

  balanceResponsibleMessage = computed(() => this.query.data()?.balanceResponsibleById);
  xmlMessage = httpResource.text(
    () => this.balanceResponsibleMessage()?.storageDocumentUrl ?? undefined
  );
}
