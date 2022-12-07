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
import { NgModule } from '@angular/core';
import { EoMediaImageDirective } from './eo-media-image.directive';
import { EoMediaComponent } from './eo-media.component';

/**
 * The Energy Origin Media components represent the classical OOCSS Media
 * object.
 *
 * @example
 * <eo-media [eoMediaGapPixels]="40" [eoMediaMaxWidthPixels]="960">
 *   <img
 *     eoMediaImage
 *     eoMediaImageAlign="end"
 *     [eoMediaImageMaxWidthPixels]="540"
 *     alt="Example image"
 *   />
 *   <!-- Any content can be added as siblings to the element with an -->
 *   <!-- `eoMediaImage` directive -->
 *   <h1>Example title</h1>
 *
 *   <p>Example copy</p>
 * </eo-media>
 */
@NgModule({
  imports: [EoMediaComponent, EoMediaImageDirective],
  exports: [EoMediaComponent, EoMediaImageDirective],
})
export class EoMediaModule {}
