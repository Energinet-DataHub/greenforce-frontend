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
import { Directive, Input } from '@angular/core';

import { EoMediaAlign } from './eo-media-align';
import { EoMediaPresenter } from './eo-media.presenter';

@Directive({
  standalone: true,
  exportAs: 'eoMediaImage',
  selector: '[eoMediaImage]',
})
export class EoMediaImageDirective {
  /**
   * Set the alignment of the media image in the media box.
   *
   * Defaults to `start`.
   */
  @Input('eoMediaImageAlign')
  set align(value: EoMediaAlign | null) {
    this.presenter.updateMediaImageAlign(value);
  }
  /**
   * Set the max width of the media image, in pixels.
   */
  @Input('eoMediaImageMaxWidthPixels')
  set maxWidthPixels(value: number | null) {
    this.presenter.updateMediaImageMaxWidthPixels(value);
  }

  constructor(private presenter: EoMediaPresenter) {}
}
