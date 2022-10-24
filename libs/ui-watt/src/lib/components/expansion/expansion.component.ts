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
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';

/**
 * Usage:
 * `import { WattExpansionModule } from '@energinet-datahub/watt/expansion';`
 */
@Component({
  selector: 'watt-expansion',
  styleUrls: ['./expansion.component.scss'],
  templateUrl: './expansion.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class WattExpansionComponent {
  @Input() openLabel = '';
  @Input() closeLabel = '';
  @Input() expanded = false;

  /**
   * @ignore
   * @param matExpansionPanel
   */
  onClose(matExpansionPanel: MatExpansionPanel) {
    matExpansionPanel.close();
  }
}
