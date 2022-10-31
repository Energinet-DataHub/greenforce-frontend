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
import { MatExpansionModule } from '@angular/material/expansion';

/**
 * Usage:
 * `import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';`
 */
@Component({
  standalone: true,
  imports: [MatExpansionModule],
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-expandable-card',
  styleUrls: ['./watt-expandable-card.component.scss'],
  templateUrl: './watt-expandable-card.component.html',
})
export class WattExpandableCardComponent {
  /** Whether the card is expanded. */
  @Input() expanded = false;
}

@Component({
  standalone: true,
  selector: 'watt-expandable-card-title',
  template: `<ng-content></ng-content>`,
})
export class WattExpandableCardTitleComponent {}

export const WATT_EXPANDABLE_CARD_COMPONENTS = [
  WattExpandableCardComponent,
  WattExpandableCardTitleComponent,
] as const;
