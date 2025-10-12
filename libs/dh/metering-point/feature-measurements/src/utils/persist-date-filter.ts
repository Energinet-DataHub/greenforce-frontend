import { effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { dayjs } from '@energinet-datahub/watt/date';

export function persistDateFilter() {
  const router = inject(Router);
  const route = inject(ActivatedRoute);
  const filter = dayjs(route.snapshot.queryParams.filter);
  const date = signal(filter.isValid() ? filter : dayjs());

  effect(() => {
    router.navigate([], {
      replaceUrl: true,
      relativeTo: route,
      queryParams: { filter: date().format('YYYY-MM-DD') },
      queryParamsHandling: 'merge',
    });
  });

  return date;
}
