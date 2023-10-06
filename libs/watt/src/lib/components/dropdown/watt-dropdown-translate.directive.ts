import { DestroyRef, Directive, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WattDropdownComponent } from './watt-dropdown.component';
import { TranslocoService } from '@ngneat/transloco';

@Directive({
  standalone: true,
  selector: '[wattDropdownTranslate]',
})
export class WattDropdownTranslateDirective implements OnInit {
  @Input({ required: true }) translate = '';
  destroyRef = inject(DestroyRef);
  constructor(private trans: TranslocoService, private host: WattDropdownComponent) {}
  ngOnInit(): void {
    this.trans
      .selectTranslateObject(this.translate)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (keys) => {
          this.host.options = this.host.options.map((option) => {
            const translatedDisplayValue = keys[option.value];
            console.log(translatedDisplayValue);
            return {
              ...option,
              displayValue: translatedDisplayValue,
            };
          });
        },
      });
  }
}
