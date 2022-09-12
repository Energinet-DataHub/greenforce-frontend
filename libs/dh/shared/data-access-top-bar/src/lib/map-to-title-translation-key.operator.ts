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
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  PRIMARY_OUTLET,
} from '@angular/router';
import type { Event } from '@angular/router';
import { filter, map, pipe } from 'rxjs';

import { defaultTitleTranslationKey } from './default-title-translation-key';
import { titleTranslationKey } from './title-translation-key';

const filterNavigationEnd = pipe(
  filter((event: Event) => event instanceof NavigationEnd),
  map((event) => event as NavigationEnd)
);

function getTitleTranslationKey(snapshot: ActivatedRouteSnapshot): string {
  let maybeTranslationKey: string | undefined;
  let route: ActivatedRouteSnapshot | undefined = snapshot.root;

  while (route !== undefined) {
    maybeTranslationKey =
      route.data[titleTranslationKey] ?? maybeTranslationKey;
    route = route.children.find((child) => child.outlet === PRIMARY_OUTLET);
  }

  return maybeTranslationKey ?? defaultTitleTranslationKey;
}

export const mapToTitleTranslationKey = (activatedRoute: ActivatedRoute) =>
  pipe(
    filterNavigationEnd,
    map(() => getTitleTranslationKey(activatedRoute.snapshot))
  );
