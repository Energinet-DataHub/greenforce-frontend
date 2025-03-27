//#region License
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
//#endregion
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

  clearBreadcrumbs(): void {
    this.breadcrumbs.set([]);
  }
}

export type Breadcrumb = {
  label: string;
  url: string;
};

export type Breadcrumbs = Breadcrumb[];
