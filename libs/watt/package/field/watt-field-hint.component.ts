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
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'watt-field-hint',
  template: `<ng-content />`,
  encapsulation: ViewEncapsulation.None,
  styles: `
    watt-field-hint {
      color: var(--watt-color-neutral-grey-700);
      display: block;
      font-size: 0.875rem;
      font-weight: 400;
      letter-spacing: 0;
      line-height: 1.25rem;
      text-transform: none;
    }
  `,
})
export class WattFieldHintComponent {}
