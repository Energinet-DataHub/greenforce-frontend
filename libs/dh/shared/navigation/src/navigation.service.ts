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
import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, EventType, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Injectable()
export class DhNavigationService {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private _id = signal<string | undefined>(undefined);

  id = this._id.asReadonly();

  constructor() {
    // Called during:
    // 1. page reload when drawer is open [followed by]
    // 2. row selection [that resuls in opening of drawer]
    this.route.firstChild?.params
      .pipe(
        map((params) => params.id),
        takeUntilDestroyed()
      )
      .subscribe(this._id.set);

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
          this._id.set(undefined);
        }
      });
  }

  navigate(path: 'details' | 'edit' | 'list', id?: string | number, ...args: string[]) {
    this._id.set(id?.toString());

    if (path === 'edit') {
      this.router.navigate(['details', id, 'edit'], {
        relativeTo: this.route,
        queryParamsHandling: 'preserve',
      });
    }

    if (path === 'list') {
      this.router.navigate(['.'], {
        queryParamsHandling: 'preserve',
        relativeTo: this.route,
      });
    }

    if (path === 'details') {
      this.router.navigate([path, id, ...args], {
        queryParamsHandling: 'preserve',
        relativeTo: this.route,
      });
    }
  }
}
