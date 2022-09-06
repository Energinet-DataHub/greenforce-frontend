import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
} from '@angular/router';
import type { Event } from '@angular/router';
import { filter, map, Observable, pipe } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';

const defaultTitleTranslationKey = '';

const filterNavigationEnd = pipe(
  filter((event: Event) => event instanceof NavigationEnd),
  map((event) => event as NavigationEnd)
);

function getTitleTranslationKey(snapshot: ActivatedRouteSnapshot): string {
  let maybeTranslationKey: string | undefined;
  let route: ActivatedRouteSnapshot | undefined = snapshot.root;

  while (route !== undefined) {
    maybeTranslationKey = route.data.titleTranslationKey ?? maybeTranslationKey;
    route = route.children.find((child) => child.outlet === PRIMARY_OUTLET);
  }

  return maybeTranslationKey ?? defaultTitleTranslationKey;
}

export const mapToTitleTranslationKey = (activatedRoute: ActivatedRoute) =>
  pipe(
    filterNavigationEnd,
    map(() => getTitleTranslationKey(activatedRoute.snapshot))
  );

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
