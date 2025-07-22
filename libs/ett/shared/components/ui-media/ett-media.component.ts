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
import { ChangeDetectionStrategy, Component, HostBinding, Input, inject } from '@angular/core';
import { RxPush } from '@rx-angular/template/push';

import { EttMediaPresenter } from './ett-media.presenter';
import { EttMediaImageDirective } from './ett-media-image.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RxPush],
  exportAs: 'ettMedia',
  providers: [EttMediaPresenter],
  selector: 'ett-media',
  styles: [
    `
      :host {
        display: block;
      }

      // 1. Keep size ratio between media body and media image.
      // 2. Center media body content and media image vertically.

      .media {
        display: inline-flex; // [1]
      }

      .media__body,
      .media__image {
        flex-grow: 1; // [1]
        flex-shrink: 1; // [1]
        flex-basis: auto; // [1]
      }

      .media__body,
      .media__image {
        display: flex; // [2]
        flex-direction: column; // [2]
        justify-content: center; // [2]
      }
    `,
  ],
  template: `
    <div class="media" [style.gap]="presenter.gap$ | push" data-testid="media-box">
      <div
        class="media__body"
        [style.flex-basis]="presenter.mediaBodyFlexBasis$ | push"
        data-testid="media-body-box"
      >
        <ng-content />
      </div>

      <div
        class="media__image"
        [style.flex-basis]="presenter.mediaImageFlexBasis$ | push"
        [style.order]="presenter.mediaImagettrder$ | push"
        data-testid="media-image-box"
      >
        <ng-content select="[ettMediaImage]" />
      </div>
    </div>
  `,
})
export class EttMediaComponent {
  presenter = inject(EttMediaPresenter);
  #maxWidthPixels: number | null = null;

  /**
   * Set the gap between flex items, in pixels.
   */
  // Intentional component export alias prefix
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('ettMediaGapPixels')
  set gapPixels(value: number | null) {
    this.presenter.updateGapPixels(value);
  }
  /**
   * Set the max width of the media box, in pixels.
   */
  // Intentional component export alias prefix
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('ettMediaMaxWidthPixels')
  @HostBinding('style.max-width.px')
  set maxWidthPixels(value: number | null) {
    this.#maxWidthPixels = value;
    this.presenter.updateMediaMaxWidthPixels(value);
  }
  get maxWidthPixels(): number | null {
    return this.#maxWidthPixels;
  }

  @HostBinding('attr.data-testid')
  get testIdAttribute(): string {
    return 'media';
  }
}

export const Ett_MEDIA = [EttMediaComponent, EttMediaImageDirective];
