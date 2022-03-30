import { NgModule } from '@angular/core';

import { EoMediaImageScam } from './eo-media-image.directive';
import { EoMediaScam } from './eo-media.component';

/**
 * The Energy Origin Media components represent the classical OOCSS Media
 * object.
 *
 * @example
 * <eo-media>
 *   <!-- Any content can be added as siblings to the element with an -->
 *   <!-- `eoMediaImage` directive -->
 *   <h1>Example title</h2>
 *
 *   <p>
 *     Example copy
 *   </p>
 *
 *   <img eoMediaImage alt="Example image" />
 * </eo-media>
 */
@NgModule({
  exports: [EoMediaScam, EoMediaImageScam],
})
export class EoMediaModule {}
