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
    maybeTranslationKey = route.data[titleTranslationKey] ?? maybeTranslationKey;
    route = route.children.find((child) => child.outlet === PRIMARY_OUTLET);
  }

  return maybeTranslationKey ?? defaultTitleTranslationKey;
}

export const mapToTitleTranslationKey = (activatedRoute: ActivatedRoute) =>
  pipe(
    filterNavigationEnd,
    map(() => getTitleTranslationKey(activatedRoute.snapshot))
  );
