import { Directive, Input, NgModule } from '@angular/core';

import { EoMediaPresenter } from './eo-media.presenter';

@Directive({
  exportAs: 'eoMediaImage',
  selector: '[eoMediaImage]',
})
export class EoMediaImageDirective {
  @Input()
  set maxWidthPixels(value: number | null) {
    this.presenter.updateMediaImageMaxWidthPixels(value);
  }

  mediaImageMaxWidthPercentage$ = this.presenter.mediaImageMaxWidthPercentage$;

  constructor(private presenter: EoMediaPresenter) {}
}

@NgModule({
  declarations: [EoMediaImageDirective],
  exports: [EoMediaImageDirective],
})
export class EoMediaImageScam {}
