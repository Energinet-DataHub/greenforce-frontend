import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattInputModule } from '@energinet-datahub/watt/input';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'dh-users-tab-search',
  standalone: true,
  template: `
    <ng-container *transloco="let t; read: 'admin.userManagement.tabs.users'">
      <watt-form-field class="search-field">
        <input
          wattInput
          [formControl]="searchControl"
          [placeholder]="t('searchPlaceholder')"
        />
        <watt-button wattSuffix variant="icon" icon="search"></watt-button>
      </watt-form-field>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .search-field {
        width: 20rem;
      }
    `,
  ],
  imports: [
    TranslocoModule,
    ReactiveFormsModule,
    WattFormFieldModule,
    WattInputModule,
    WattButtonModule,
  ],
})
export class DhUsersTabSearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('', { nonNullable: true });

  @Output() search = new EventEmitter<string>();

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => this.search.emit(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
