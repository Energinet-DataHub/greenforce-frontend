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
import { ActivatedRoute } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import { combineLatest, filter, map, Observable, switchMap } from 'rxjs';
import { EoTermsService } from './eo-terms.service';

interface EoTermsState {
  readonly version: string | null;
}

@Injectable()
export class EoTermsStore extends ComponentStore<EoTermsState> {
  #authState$: Observable<string> = this.select(
    this.route.queryParams,
    (params) => params['state']
  );

  #version$: Observable<string> = this.select((state) => state.version).pipe(
    filter((version) => version !== null),
    map((version) => version as string)
  );

  constructor(private route: ActivatedRoute, private service: EoTermsService) {
    super({ version: null });
  }

  onVersionChange = this.updater<string>(
    (state, version): EoTermsState => ({
      ...state,
      version,
    })
  );

  onAcceptTerms() {
    return combineLatest([this.#authState$, this.#version$]).pipe(
      switchMap(([state, version]) =>
        this.service.postAcceptTerms({ state, version, accepted: true })
      )
    );
  }
}
