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
import { Component } from '@angular/core';

@Component({
  selector: 'watt-empty-state-no-results',
  template: `
    <svg viewBox="0 0 128 128" fill="none">
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M64 116c28.719 0 52-23.281 52-52S92.719 12 64 12 12 35.281 12 64s23.281 52 52 52Zm0 2c29.823 0 54-24.177 54-54S93.823 10 64 10 10 34.177 10 64s24.177 54 54 54Z"
        clip-rule="evenodd"
      />
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M63.91 65.91 42 87.82l-1.414-1.414 21.91-21.91L40 42l1.414-1.414L63.91 63.082l22.496-22.497L87.82 42 65.325 64.496l21.91 21.91-1.413 1.414-21.91-21.91Z"
        clip-rule="evenodd"
      />
    </svg>
  `,
})
export class WattEmptyStateNoResultsComponent {}
