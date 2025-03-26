import { effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EventType, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DhBreadcrumbService {
  private router = inject(Router);

  navigationEnded = toSignal(
    this.router.events.pipe(filter((event) => event.type === EventType.NavigationEnd))
  );
  breadcrumbs = signal<Breadcrumbs>([]);

  constructor() {
    effect(() => {
      const navigationEnded = this.navigationEnded();
      if (navigationEnded) {
        this.clearBreadcrumbs();
      }
    });
  }
  addBreadcrumb(breadcrumb: Breadcrumb): void {
    this.breadcrumbs.update((breadcrumbs) => [...breadcrumbs, breadcrumb]);
  }

  private clearBreadcrumbs(): void {
    this.breadcrumbs.set([]);
  }
}

export type Breadcrumb = {
  label: string;
  url: string;
};

export type Breadcrumbs = Breadcrumb[];
