import { DestroyRef, Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Directive({
  standalone: true,
  selector: '[wattQueryParams]',
})
export class WattQueryParamsDirective implements OnInit {
  private formGroup = inject(FormGroupDirective);
  private destoryRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.formGroup.valueChanges
      ?.pipe(takeUntilDestroyed(this.destoryRef))
      .subscribe((formValues) => {
        for (const key in formValues) {
          if (formValues[key] === null || formValues[key] === undefined) {
            delete formValues[key];
          }
        }

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            state: JSON.stringify(formValues),
          },
          queryParamsHandling: 'merge',
        });
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { state: JSON.stringify(formValues) },
          queryParamsHandling: 'merge',
        });
      });

    if (location.search) {
      const queryParams = new URLSearchParams(location.search);
      const value = JSON.parse(queryParams.get('state') ?? '');
      this.formGroup.control.patchValue(value);
    }
  }
}
