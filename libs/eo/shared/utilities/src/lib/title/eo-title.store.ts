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
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import { filter, map, Observable, tap } from 'rxjs';

import { mapToRouteTitle } from './map-to-route-title.operator';

interface EoTitleState {
  readonly routeTitle: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class EoTitleStore extends ComponentStore<EoTitleState> {
  routeTitle$: Observable<string> = this.select((state) => state.routeTitle).pipe(
    filter((title) => title !== null),
    map((title) => title as string)
  );

  constructor(private documentTitle: Title, private router: Router) {
    super(initialState);

    this.#updateRouteTitle(this.router.events.pipe(mapToRouteTitle));
    this.#synchronizeToDocumentTitle(this.routeTitle$);
  }

  #synchronizeToDocumentTitle = this.effect<string>((routeTitle$) =>
    routeTitle$.pipe(
      map((routeTitle) => `${routeTitle} | Energy Origin`),
      tap((documentTitle) => this.documentTitle.setTitle(documentTitle))
    )
  );

  #updateRouteTitle = this.updater<string>(
    (state, routeTitle): EoTitleState => ({ ...state, routeTitle })
  );
}

const initialState: EoTitleState = {
  routeTitle: null,
};
