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
import { ChangeDetectionStrategy, Component, input, TemplateRef, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  imports: [NgClass],
  selector: 'watt-description-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NgClass],
  template: `<ng-template #templateRef
    ><div [ngClass]="{ 'force-new-row': forceNewRow() }">
      <dt class="watt-label watt-on-light--high-emphasis">{{ label() }}</dt>
      <dd class="watt-text-s">{{ value() }}<ng-content /></dd></div
  ></ng-template>`,
})
export class WattDescriptionListItemComponent<T> {
  templateRef = viewChild.required<TemplateRef<unknown | null>>('templateRef');
  label = input<string>('');
  value = input<T | null>(null);
  forceNewRow = input(false);
}
