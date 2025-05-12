import { inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

/** Small inject helper for navigating relative to current route. */
export function injectRelativeNavigate() {
  const router = inject(Router);
  const activatedRoute = inject(ActivatedRoute);
  return (commands: string | string[], extras?: NavigationExtras) =>
    router.navigate(([] as string[]).concat(commands), { relativeTo: activatedRoute, ...extras });
}
