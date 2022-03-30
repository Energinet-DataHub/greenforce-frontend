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
  mediaMaxWidthPixels: number | null;
  mediaImageAlign: EoMediaAlign;
  mediaImageMaxWidthPixels: number | null;
}

@Injectable()
export class EoMediaPresenter extends ComponentStore<EoMediaState> {
  mediaImageOrder$: Observable<number> = this.select(
    this.select((state) => state.mediaImageAlign),
    (align) =>
      align === 'start' ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER
  );
  mediaImageMaxWidthPercentage$: Observable<number | null> = this.select(
    this.select((state) => state.mediaMaxWidthPixels),
    this.select((state) => state.mediaImageMaxWidthPixels),
    (mediaMaxWidthPixels, mediaImageMaxWidthPixels) => {
      if (mediaMaxWidthPixels === null || mediaImageMaxWidthPixels === null) {
        return null;
      }

      return (mediaImageMaxWidthPixels / mediaMaxWidthPixels) * 100;
    },
    {
      debounce: true,
    }
  );
  mediaGridTemplateColumns$: Observable<string | null> = this.select(
    this.mediaImageMaxWidthPercentage$,
    (imageMaxWidthPercentage) =>
      imageMaxWidthPercentage === null
        ? null
        : `${100 - imageMaxWidthPercentage}% ${imageMaxWidthPercentage}%`
  );

  constructor() {
    super(initialState);
  }

  updateMediaMaxWidthPixels = this.updater<number | null>(
    (state, mediaMaxWidthPixels): EoMediaState => ({
      ...state,
      mediaMaxWidthPixels,
    })
  );

  updateMediaImageAlign = this.updater<EoMediaAlign>(
    (state, mediaImageAlign): EoMediaState => ({
      ...state,
      mediaImageAlign,
    })
  );

  updateMediaImageMaxWidthPixels = this.updater<number | null>(
    (state, mediaImageMaxWidthPixels): EoMediaState => ({
      ...state,
      mediaImageMaxWidthPixels,
    })
  );
}

const initialState: EoMediaState = {
  mediaMaxWidthPixels: null,
  mediaImageAlign: 'start',
  mediaImageMaxWidthPixels: null,
};
