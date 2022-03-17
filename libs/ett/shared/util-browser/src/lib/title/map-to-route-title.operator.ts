import { ActivationEnd, Event } from '@angular/router';
import { filter, map, pipe } from 'rxjs';

const filterActivationEnd = pipe(
  filter((event: Event) => event instanceof ActivationEnd),
  map((event) => event as ActivationEnd)
);

const mapToRouteData = pipe(map((event: ActivationEnd) => event.snapshot.data));

export const mapToRouteTitle = pipe(
  filterActivationEnd,
  mapToRouteData,
  map((data) => data.title as string | undefined),
  filter((title) => title !== undefined),
  map((title) => title as string)
);
