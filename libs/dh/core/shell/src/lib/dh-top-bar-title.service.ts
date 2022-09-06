import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ActivationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import type { Event } from '@angular/router';
import {
  BehaviorSubject,
  filter,
  first,
  map,
  of,
  pipe,
  switchMap,
  tap,
} from 'rxjs';

const filterActivationEnd = pipe(
  filter((event: Event) => event instanceof ActivationEnd),
  map((event) => event as ActivationEnd)
);

function buildTitle(snapshot: RouterStateSnapshot): string | undefined {
  let pageTitle: string | undefined;
  let route: ActivatedRouteSnapshot | undefined = snapshot.root;

  while (route !== undefined) {
    pageTitle = route.data.titleTranslationKey ?? pageTitle;
    route = route.children.find((child) => child.outlet === PRIMARY_OUTLET);
  }

  return pageTitle;
}

const mapToRouteData = pipe(
  map((event: ActivationEnd) => {
    // console.log('ROUTE', event.snapshot.data);

    let pageTitle: string | undefined;
    let route: ActivatedRouteSnapshot | undefined = event.snapshot.root;

    while (route !== undefined) {
      pageTitle = route.data.titleTranslationKey ?? pageTitle;
      route = route.children.find((child) => child.outlet === PRIMARY_OUTLET);
    }

    return pageTitle;
  })
);

export const mapToRouteTitle = pipe(
  filterActivationEnd,
  mapToRouteData,
  // map((data) => data.titleTranslationKey as string | undefined),
  filter((translationKey) => translationKey !== undefined),
  map((title) => title as string),
  switchMap((title) =>
    of(title).pipe(
      // tap((title) => console.log(title)),
      first()
    )
  )
);

@Injectable({
  providedIn: 'root',
})
export class DhTopBarTitleService {
  private tranlationKeySubject = new BehaviorSubject<string>('');

  public readonly tranlationKey$ = this.tranlationKeySubject.asObservable();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(
        mapToRouteTitle,
        tap((tranlationKey) => {
          let route = this.activatedRoute;

          while (route.firstChild) {
            route = route.firstChild;
          }

          console.log('activatedRoute', route.data);

          this.tranlationKeySubject.next(tranlationKey || '');
        })
      )
      .subscribe();
  }
}
