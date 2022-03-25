import { NgModule } from '@angular/core';

import { EoMediaImageScam } from './eo-media-image.component';
import { EoMediaScam } from './eo-media.component';

/**
 * The Energy Origin Media components represent the classical OOCSS Media
 * object.
 *
 * @example
 * <eo-media>
 *   <!-- Any content can be added next to the `eo-media-image` element -->
 *   <h1>Example title</h2>
 *
 *   <p>
 *     Example copy
 *   </p>
 *
 *   <eo-media-image>
 *     <img alt="Example image" />
 *   </eo-media-image>
 * </eo-media>
 */
@NgModule({
  exports: [EoMediaScam, EoMediaImageScam],
})
export class EoMediaModule {}
