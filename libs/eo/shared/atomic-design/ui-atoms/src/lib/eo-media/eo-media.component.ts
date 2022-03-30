import { ChangeDetectionStrategy, Component, HostBinding, Input, NgModule } from '@angular/core';
import { PushModule } from '@rx-angular/template';
import { Observable } from 'rxjs';

import { EoMediaPresenter } from './eo-media.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-media',
  styles: [
    `
      :host {
        display: block;
      }

      .media {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 40px;
      }
    `,
  ],
  template: `
    <div
      class="media"
      [style.grid-template-columns]="gridTemplateColumns$ | push"
    >
      <div class="media___body">
        <ng-content></ng-content>
      </div>

      <div class="media__image">
        <ng-content select="[eo-media-image]"></ng-content>
      </div>
    </div>
  `,
  providers: [EoMediaPresenter],
})
export class EoMediaComponent {
  #maxWidthPixels: number | null = null;

  @HostBinding('style.max-width.px')
  @Input()
  set maxWidthPixels(value: number | null) {
    this.#maxWidthPixels = value;
    this.presenter.updateMediaMaxWidthPixels(value);
  }
  get maxWidthPixels(): number | null {
    return this.#maxWidthPixels;
  }

  gridTemplateColumns$: Observable<string | null> =
    this.presenter.mediaGridTemplateColumns$;

  constructor(private presenter: EoMediaPresenter) {}
}

@NgModule({
  declarations: [EoMediaComponent],
  exports: [EoMediaComponent],
  imports: [PushModule],
})
export class EoMediaScam {}
