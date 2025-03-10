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
  selector: 'watt-flag-fi',
  template: `
    <svg viewBox="0 0 640 480">
      <path fill="#fff" d="M0 0h640v480H0z" />
      <path fill="#002f6c" d="M0 174.5h640v131H0z" />
      <path fill="#002f6c" d="M175.5 0h130.9v480h-131z" />
    </svg>
  `,
})
export class WattFlagFinlandComponent {}
