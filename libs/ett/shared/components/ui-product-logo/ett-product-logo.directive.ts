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
import { Directive, HostBinding, Input } from '@angular/core';

const selector = 'ettProductLogo';

@Directive({
  exportAs: selector,
  selector: 'img[' + selector + ']',
})
export class EttProductLogoDirective {
  @HostBinding('attr.alt')
  get altAttribute(): string {
    return 'Energy Track and Trace';
  }
  @HostBinding('attr.src')
  get srcAttribute(): string {
    if (this.version === 'secondary') {
      return '/assets/images/energy-track-and-trace-logo-secondary.svg';
    } else {
      return '/assets/images/energy-track-and-trace-logo.svg';
    }
  }

  @Input() version: 'default' | 'secondary' = 'default';
}
