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
          queryParams: { [filtersKey]: hasSetProperties ? qs.stringify(formValuesClone) : null },
          queryParamsHandling: 'merge',
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
