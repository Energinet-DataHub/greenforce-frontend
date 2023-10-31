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
import { DestroyRef, Directive, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { TranslocoService } from '@ngneat/transloco';
import { withLatestFrom } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[dhDropdownTranslator]',
})
export class DhDropdownTranslatorDirective implements OnInit {
  @Input({ required: true }) translate = '';
  destroyRef = inject(DestroyRef);

  constructor(private trans: TranslocoService, private host: WattDropdownComponent) {}

  ngOnInit(): void {
    this.host.filteredOptions$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLatestFrom(this.trans.selectTranslateObject<object>(this.translate))
      )
      .subscribe(([, keys]) => {
        this.setTranslation(keys);
      });

    this.trans
      .selectTranslateObject<object>(this.translate)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (keys) => {
          this.setTranslation(keys);
        },
      });
  }

  private setTranslation(keys: object): void {
    this.host.options.forEach((option) => {
      option.displayValue = keys[option.value as keyof typeof keys];
    });
  }
}
