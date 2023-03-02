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
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';

import { EoMediaAlign } from './eo-media-align';

interface EoMediaState {
  /**
   * Gap between flex items.
   */
  gapPixels: number | null;
  /**
   * Max width of the media box.
   */
  mediaMaxWidthPixels: number | null;
  /**
   * Alignment of the media image in the media box.
   */
  mediaImageAlign: EoMediaAlign;
  /**
   * Max width of the media image.
   */
  mediaImageMaxWidthPixels: number | null;
}

@Injectable()
export class EoMediaPresenter extends ComponentStore<EoMediaState> {
  #gapPixels$: Observable<number | null> = this.select((state) => state.gapPixels);
  #mediaImageMaxWidthPixels$: Observable<number | null> = this.select(
    (state) => state.mediaImageMaxWidthPixels
  );
  #mediaBodyMaxWidthPixels$: Observable<number | null> = this.select(
    this.#mediaImageMaxWidthPixels$,
    this.select((state) => state.mediaMaxWidthPixels),
    this.#gapPixels$,
    (mediaImageMaxWidthPixels, mediaMaxWidthPixels, gapPixels) => {
      if (mediaImageMaxWidthPixels === null || mediaMaxWidthPixels === null) {
        return null;
      }

      gapPixels ??= 0;

      return mediaMaxWidthPixels - mediaImageMaxWidthPixels - gapPixels;
    }
  );

  /**
   * Gap between flex items.
   */
  gap$: Observable<string | null> = this.select(this.#gapPixels$, (gapPixels) =>
    gapPixels === null ? null : `${gapPixels}px`
  );
  /**
   * Flex basis of the media body.
   */
  mediaBodyFlexBasis$: Observable<string | null> = this.select(
    this.#mediaBodyMaxWidthPixels$,
    (maxWidthPixels) => (maxWidthPixels === null ? null : `${maxWidthPixels}px`)
  );
  /**
   * Flex basis of the media image.
   */
  mediaImageFlexBasis$: Observable<string | null> = this.select(
    this.#mediaImageMaxWidthPixels$,
    (maxWidthPixels) => (maxWidthPixels === null ? null : `${maxWidthPixels}px`)
  );
  /**
   * Flex item order of the media image.
   */
  mediaImageOrder$: Observable<number> = this.select(
    this.select((state) => state.mediaImageAlign),
    (align) => (align === 'start' ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER),
    {
      debounce: true,
    }
  );

  constructor() {
    super(initialState);
  }

  /**
   * Set the gap between flex items, in pixels.
   */
  updateGapPixels = this.updater<number | null>(
    (state, gapPixels): EoMediaState => ({
      ...state,
      gapPixels,
    })
  );

  /**
   * Set the max width of the media box, in pixels.
   */
  updateMediaMaxWidthPixels = this.updater<number | null>(
    (state, mediaMaxWidthPixels): EoMediaState => ({
      ...state,
      mediaMaxWidthPixels,
    })
  );

  /**
   * Set the alignment of the media image in the media box.
   *
   * Defaults to 'start'.
   */
  updateMediaImageAlign = this.updater<EoMediaAlign | null>(
    (state, mediaImageAlign): EoMediaState => ({
      ...state,
      mediaImageAlign: mediaImageAlign ?? defaultMediaImageAlign,
    })
  );

  /**
   * Set the max width of the media image, in pixels.
   */
  updateMediaImageMaxWidthPixels = this.updater<number | null>(
    (state, mediaImageMaxWidthPixels): EoMediaState => ({
      ...state,
      mediaImageMaxWidthPixels,
    })
  );
}

const defaultMediaImageAlign: EoMediaAlign = 'start';
const initialState: EoMediaState = {
  gapPixels: null,
  mediaMaxWidthPixels: null,
  mediaImageAlign: defaultMediaImageAlign,
  mediaImageMaxWidthPixels: null,
};
