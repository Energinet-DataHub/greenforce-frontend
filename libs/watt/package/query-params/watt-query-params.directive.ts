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
import { DestroyRef, Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

const filtersKey = 'filters';

@Directive({
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

        //Todo: Use toBase68 instead of btoa and atop when typescript 5.10 drops.
        const encodedFormValues = new TextEncoder().encode(JSON.stringify(formValuesClone));

        const base64FormValues = btoa(String.fromCharCode(...encodedFormValues));

        this.router.navigate([], {
          replaceUrl: true,
          relativeTo: this.route,
          queryParams: { [filtersKey]: hasSetProperties ? base64FormValues : null },
          queryParamsHandling: 'merge',
        });
      });

    if (Object.keys(this.route.snapshot.queryParams).length > 0) {
      const value = atob(this.route.snapshot.queryParams[filtersKey] ?? '');
      const decodedFormValues = new TextDecoder().decode(
        Uint8Array.from(value, (c) => c.charCodeAt(0))
      );
      const parsedValue = JSON.parse(decodedFormValues);

      this.formGroup.control.patchValue(parsedValue);
    }
  }
}
