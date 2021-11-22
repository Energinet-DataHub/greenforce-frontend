/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';

import {
  WattButtonModule,
  WattFormFieldModule,
  WattIconModule,
  WattInputModule,
} from '@energinet-datahub/watt';
import { CommonModule } from '@angular/common';

import { meteringPointIdValidator } from './dh-metering-point.validator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-search-form',
  styleUrls: ['./dh-metering-point-search-form.component.scss'],
  templateUrl: './dh-metering-point-search-form.component.html',
})
export class DhMeteringPointSearchFormComponent
  implements OnChanges, AfterViewInit
{
  @Input() loading = false;
  @Input() value = '';
  @Output() search = new EventEmitter<string>();

  @ViewChild('searchInput') searchInput?: ElementRef;

  searchControl = new FormControl('', [Validators.required, meteringPointIdValidator()]);

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value && changes.value.currentValue !== '') {
      // If not applied, error message won't be shown on initial value if value is invalid
      setTimeout(() => {
        this.searchControl.setValue(this.value);
        this.searchControl.markAsTouched();
      });
    }
  }

  ngAfterViewInit() {
    this.focusSearchInput();
  }

  onSearchInputClear(): void {
    this.searchControl.setValue('');
  }

  onSubmit() {
    console.log(this.searchControl);
    if (!this.searchControl.valid) {
      this.focusSearchInput();
      return;
    } else if (this.loading) return;

    this.search.emit(this.searchControl.value);
  }

  private focusSearchInput(): void {
    this.searchInput?.nativeElement.focus();
  }
}

@NgModule({
  imports: [
    WattFormFieldModule,
    WattInputModule,
    WattButtonModule,
    WattIconModule,
    TranslocoModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  declarations: [DhMeteringPointSearchFormComponent],
  exports: [DhMeteringPointSearchFormComponent, ReactiveFormsModule],
})
export class DhMeteringPointSearchFormScam {}
