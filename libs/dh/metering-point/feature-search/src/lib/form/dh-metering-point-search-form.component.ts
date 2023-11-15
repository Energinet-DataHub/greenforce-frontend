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
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';

import { meteringPointIdValidator } from './dh-metering-point.validator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-search-form',
  styleUrls: ['./dh-metering-point-search-form.component.scss'],
  templateUrl: './dh-metering-point-search-form.component.html',
  standalone: true,
  imports: [
    WattButtonComponent,
    WattIconComponent,
    TranslocoModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    WattTextFieldComponent,
    WattFieldErrorComponent,
  ],
})
export class DhMeteringPointSearchFormComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);
  @Input()
  loading = false;
  @Output()
  search = new EventEmitter<string>();
  @ViewChild('searchInput')
  searchInput?: WattTextFieldComponent;

  queryParamsSubscription?: Subscription;

  searchControl = new FormControl('', [meteringPointIdValidator()]);

  ngAfterViewInit() {
    this.queryParamsSubscription = this.route.queryParams.subscribe((params) => {
      this.setInitialValue(params.q);
      this.focusSearchInput();
    });

    this.focusSearchInput();
  }

  ngOnDestroy() {
    this.queryParamsSubscription?.unsubscribe();
  }

  onSearchInputClear(): void {
    this.searchControl.setValue('');
    this.updateQueryParam(null);
  }

  onSubmit() {
    this.updateQueryParam(this.searchControl.value);

    if (!this.searchControl.valid) {
      return this.focusSearchInput();
    } else if (this.loading) {
      return;
    }

    this.search.emit(this.searchControl.value ?? '');
  }

  private updateQueryParam(q: string | null | undefined): void {
    this.router.navigate([], { queryParams: { q } });
  }

  private setInitialValue(value: string | undefined | null): void {
    this.searchControl.setValue(value ?? '');

    if (!value) {
      this.searchControl.markAsUntouched();
    } else {
      this.searchControl.markAsTouched();
      this.searchControl.markAsDirty();
    }

    /*
     * If detectChanges is not called,
     * the error messages will not be shown until the user blur the input
     */
    this.changeDetectorRef.detectChanges();
  }

  private focusSearchInput(): void {
    this.searchInput?.setFocus();
    this.changeDetectorRef.detectChanges();
  }
}
