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
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';

import { mapToTitleTranslationKey } from './map-to-title-translation-key.operator';
import { defaultTitleTranslationKey } from './default-title-translation-key';

interface DhTopBarState {
  readonly titleTranslationKey: string;
}

const initialState: DhTopBarState = {
  titleTranslationKey: defaultTitleTranslationKey,
};

@Injectable({
  providedIn: 'root',
})
export class DhTopBarStore extends ComponentStore<DhTopBarState> {
  titleTranslationKey$: Observable<string> = this.select(
    (state) => state.titleTranslationKey
  );

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    super(initialState);

    this.updateTitleTranslationKey(
      this.router.events.pipe(mapToTitleTranslationKey(this.activatedRoute))
    );
  }

  private updateTitleTranslationKey = this.updater<string>(
    (state, titleTranslationKey): DhTopBarState => ({
      ...state,
      titleTranslationKey,
    })
  );
}
