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
          this.host.options = this.host.options.map((option) => ({
            ...option,
            displayValue: keys[option.value],
          }));
        },
      });
  }
}
