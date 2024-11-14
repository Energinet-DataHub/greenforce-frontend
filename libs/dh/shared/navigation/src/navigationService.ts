import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, EventType, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Injectable()
export class DhNavigationService {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id = signal<string | undefined>(undefined);

  constructor() {
    // Called during:
    // 1. page reload when drawer is open [followed by]
    // 2. row selection [that resuls in opening of drawer]
    this.route.firstChild?.params
      .pipe(
        map((params) => params.id),
        takeUntilDestroyed()
      )
      .subscribe(this.id.set);

    // Called during:
    // 1. navigation to route defined by this component
    // 2. row selection [that resuls in opening of drawer]
    // 3. closing of drawer
    this.router.events
      .pipe(
        filter((event) => event.type === EventType.NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        if (this.route.children.length === 0) {
          this.id.set(undefined);
        }
      });
  }

  navigate(id: string | undefined, path: 'details' | 'edit') {
    this.id.set(id);
    this.router.navigate([path, id], {
      relativeTo: this.route,
    });
  }
}
