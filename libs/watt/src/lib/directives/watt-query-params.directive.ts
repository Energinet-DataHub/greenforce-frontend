import { DestroyRef, Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroupDirective } from '@angular/forms';

@Directive({
  standalone: true,
  selector: '[wattQueryParams]',
})
export class WattQueryParamsDirective implements OnInit {
  private formGroup = inject(FormGroupDirective);
  private destoryRef = inject(DestroyRef);

  ngOnInit(): void {
    console.log(this.formGroup.valueChanges);
    this.formGroup.valueChanges
      ?.pipe(takeUntilDestroyed(this.destoryRef))
      .subscribe((formValues) => {
        console.log({ formValues });
      });
  }
}
