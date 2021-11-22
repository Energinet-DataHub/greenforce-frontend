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
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  NgModule,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {
  dhMeteringPointPath,
  dhMeteringPointSearchPath,
} from '@energinet-datahub/dh/metering-point/routing';
import {
  WattButtonModule,
  WattFormFieldModule,
  WattIconModule,
  WattInputModule,
} from '@energinet-datahub/watt';

import { meteringPointIdValidator } from './dh-metering-point.validator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-search-form',
  styleUrls: ['./dh-metering-point-search-form.component.scss'],
  templateUrl: './dh-metering-point-search-form.component.html',
})
export class DhMeteringPointSearchFormComponent implements AfterViewInit {
  @Output() search = new EventEmitter<string>();
  @ViewChild('searchInput') searchInput?: ElementRef;

  loading = false;
  searchControl = new FormControl('', [
    Validators.required,
    meteringPointIdValidator(),
  ]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.setInitialValue();
    this.focusSearchInput();
  }

  onSearchInputClear(): void {
    this.searchControl.setValue('');
  }

  onSubmit() {
    this.router.navigate(
      [`/${dhMeteringPointPath}/${dhMeteringPointSearchPath}`],
      { queryParams: { q: this.searchControl.value } }
    );

    if (!this.searchControl.valid) {
      this.focusSearchInput();
      return;
    } else if (this.loading) return;

    /*
     * If detectChanges is not called,
     * loading indicator will not be shown until the user blur the input
     */
    this.loading = true;
    this.changeDetectorRef.detectChanges();

    this.search.emit(this.searchControl.value);
  }

  private setInitialValue(): void {
    const query = this.route.snapshot.queryParams.q;
    if (!query) return;

    this.searchControl.setValue(query);
    this.searchControl.markAsTouched();

    /*
     * If detectChanges is not called,
     * the error messages will not be shown until the user blur the input
     */
    this.changeDetectorRef.detectChanges();

    this.onSubmit();
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
