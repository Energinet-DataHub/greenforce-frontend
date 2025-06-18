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
import { VaterUtilityDirective } from './vater-utility.directive';
import { VaterLayoutDirective } from './vater-layout.directive';

@Component({
  selector: 'vater-stack, [vater-stack]',
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [
    {
      directive: VaterLayoutDirective,
      inputs: ['align', 'direction', 'justify', 'wrap', 'gap', 'offset'],
    },
    {
      directive: VaterUtilityDirective,
      inputs: ['center', 'fill', 'inset', 'scrollable'],
    },
  ],
  styles: `
    vater-stack,
    [vater-stack] {
      display: flex;
      line-height: normal;
    }
  `,
  template: `<ng-content />`,
})
export class VaterStackComponent {}
