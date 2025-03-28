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
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

@Component({
  selector: 'dh-tab-data-general-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <watt-empty-state
      icon="custom-power"
      [title]="'shared.error.title' | transloco"
      [message]="'shared.error.message' | transloco"
    >
      <watt-button (click)="reload.emit()" variant="primary">{{
        'shared.error.button' | transloco
      }}</watt-button>
    </watt-empty-state>
  `,
  imports: [TranslocoPipe, WattButtonComponent, WattEmptyStateComponent],
})
export class DhTabDataGeneralErrorComponent {
  @Output() reload = new EventEmitter<void>();
}
