import { DestroyRef, Directive, OnInit, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@ngneat/transloco';

import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

@Directive({
  standalone: true,
  selector: '[dhDropdownTranslator]',
})
export class DhDropdownTranslatorDirective implements OnInit {
  private translocoService = inject(TranslocoService);
  private host = inject(WattDropdownComponent);
  private destroyRef = inject(DestroyRef);

  translateKey = input.required<string>();

  translation = signal<object | undefined>(undefined);

  options = input<WattDropdownOptions>([]);

  constructor() {
    effect(() => {
      const options = this.options();
      const keys = this.translation();

      if (!keys) return;

      const translatedOptions = options.map((option) => ({
        ...option,
        displayValue: this.translateDisplayValue(keys[option.value as keyof typeof keys]),
      }));

      // Sort translatedOptions based on the order of the translation keys
      const keyOrder = Object.keys(keys);
      translatedOptions.sort((a, b) => keyOrder.indexOf(a.value) - keyOrder.indexOf(b.value));

      this.host.options = this.host.sortDirection
        ? this.host.sortOptions(translatedOptions)
        : translatedOptions;
    });
  }

  ngOnInit(): void {
    this.translocoService
      .selectTranslateObject<object>(this.translateKey())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((keys) => this.translation.set(keys));
  }

  private translateDisplayValue(value: string | undefined) {
    if (value && value.startsWith('{{')) {
      const key = value.replace(/{{|}}/g, '').trim();

      return this.translocoService.translate(key);
    }

    return value ?? this.translateKey();
  }
}
