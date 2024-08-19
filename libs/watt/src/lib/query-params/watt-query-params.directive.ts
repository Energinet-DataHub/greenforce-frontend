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
import { DestroyRef, Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import qs from 'qs';

const filtersKey = 'filters';

@Directive({
  standalone: true,
  selector: '[formGroup][wattQueryParams]',
})
export class WattQueryParamsDirective implements OnInit {
  private formGroup = inject(FormGroupDirective);
  private destoryRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  ngOnInit(): void {
    this.formGroup.valueChanges
      ?.pipe(takeUntilDestroyed(this.destoryRef))
      .subscribe((formValues) => {
        const formValuesClone = structuredClone(formValues);

        for (const key in formValuesClone) {
          if (formValuesClone[key] === null || formValuesClone[key] === undefined) {
            delete formValuesClone[key];
          }
        }

        const hasSetProperties = Object.keys(formValuesClone).length > 0;

        this.router.navigate([], {
          replaceUrl: true,
          relativeTo: this.route,
          queryParams: hasSetProperties ? { [filtersKey]: qs.stringify(formValuesClone) } : null,
          queryParamsHandling: hasSetProperties ? 'merge' : null,
        });
      });

    if (Object.keys(this.route.snapshot.queryParams).length > 0) {
      const value = qs.parse(this.route.snapshot.queryParams[filtersKey] ?? '', {
        // Needed because `qs` library has a default value of 20 elements
        // after which arrays are parsed as objects
        // See https://github.com/ljharb/qs?tab=readme-ov-file#parsing-arrays
        arrayLimit: 200,
      });

      this.formGroup.control.patchValue(value);
    }
  }
}
