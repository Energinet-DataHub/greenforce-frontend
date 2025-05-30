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
  selector: 'watt-flag-nl',
  template: `
    <svg viewBox="0 0 640 480">
      <path fill="#21468b" d="M0 0h640v480H0z" />
      <path fill="#fff" d="M0 160h640v160H0z" />
      <path fill="#ae1c28" d="M0 320h640v160H0z" />
    </svg>
  `,
})
export class WattFlagNetherlandsComponent {}
