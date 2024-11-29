import { Directive, Input, inject } from '@angular/core';

import { EoMediaAlign } from './eo-media-align';
import { EoMediaPresenter } from './eo-media.presenter';

@Directive({
  standalone: true,
  exportAs: 'eoMediaImage',
  selector: '[eoMediaImage]',
})
export class EoMediaImageDirective {
  private presenter = inject(EoMediaPresenter);
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
}
