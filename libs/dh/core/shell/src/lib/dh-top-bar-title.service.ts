import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
} from '@angular/router';
import type { Event } from '@angular/router';
import { BehaviorSubject, filter, map, pipe } from 'rxjs';

const filterNavigationEnd = pipe(
  filter((event: Event) => event instanceof NavigationEnd),
  map((event) => event as NavigationEnd)
);

function getTitleTranslationKey(
  snapshot: ActivatedRouteSnapshot
): string | undefined {
  let translationKey: string | undefined;
  let route: ActivatedRouteSnapshot | undefined = snapshot.root;

  while (route !== undefined) {
    translationKey = route.data.titleTranslationKey ?? translationKey;
    route = route.children.find((child) => child.outlet === PRIMARY_OUTLET);
  }

  return translationKey;
}

const defaultTopBarTitle = '';

@Injectable({
  providedIn: 'root',
})
export class DhTopBarTitleService {
  private tranlationKeySubject = new BehaviorSubject<string>('');

  public readonly tranlationKey$ = this.tranlationKeySubject.asObservable();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(
        filterNavigationEnd,
        map(() => this.activatedRoute),
        map((route) => getTitleTranslationKey(route.snapshot))
      )
      .subscribe((maybeTranslationKey) => {
        this.tranlationKeySubject.next(
          maybeTranslationKey ?? defaultTopBarTitle
        );
      });
  }
}
