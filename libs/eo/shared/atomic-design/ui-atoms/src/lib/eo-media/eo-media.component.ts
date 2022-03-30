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
import { ChangeDetectionStrategy, Component, HostBinding, Input, NgModule } from '@angular/core';
import { PushModule } from '@rx-angular/template';
import { Observable } from 'rxjs';

import { EoMediaPresenter } from './eo-media.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'eoMedia',
  providers: [EoMediaPresenter],
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

      <div
        class="media__image"
        [style.order]="presenter.mediaImageOrder$ | push"
      >
        <ng-content select="[eoMediaImage]"></ng-content>
      </div>
    </div>
  `,
})
export class EoMediaComponent {
  #maxWidthPixels: number | null = null;

  @HostBinding('style.max-width.px')
  // Intentional component export alias prefix
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('eoMediaMaxWidthPixels')
  set maxWidthPixels(value: number | null) {
    this.#maxWidthPixels = value;
    this.presenter.updateMediaMaxWidthPixels(value);
  }
  get maxWidthPixels(): number | null {
    return this.#maxWidthPixels;
  }

  gridTemplateColumns$: Observable<string | null> =
    this.presenter.mediaGridTemplateColumns$;

  constructor(public presenter: EoMediaPresenter) {}
}

@NgModule({
  declarations: [EoMediaComponent],
  exports: [EoMediaComponent],
  imports: [PushModule],
})
export class EoMediaScam {}
