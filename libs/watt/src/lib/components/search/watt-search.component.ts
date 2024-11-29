import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Component, ElementRef, input, viewChild } from '@angular/core';

import { BehaviorSubject, debounceTime, skip } from 'rxjs';

import { WattIconComponent } from '../../foundations/icon/icon.component';

@Component({
  standalone: true,
  imports: [WattIconComponent],
  selector: 'watt-search',
  styleUrls: ['./watt-search.component.scss'],
  template: `
    <label>
      <input
        #input
        type="text"
        role="searchbox"
        [placeholder]="label()"
        (input)="search$.next(input.value)"
      />
      <span class="wrapper">
        <span class="button">
          <watt-icon name="search" size="s" aria-hidden="true" />
          <span class="text">{{ label() }}</span>
        </span>
      </span>
      <button class="clear" (click)="clear()">
        <watt-icon name="close" size="s" />
      </button>
    </label>
  `,
})
export class WattSearchComponent {
  /**
   * @ignore
   */
  input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  /**
   * @ignore
   */
  label = input<string>('');

  /**
   * @ignore
   */
  debounceTime = input<number>(300);

  /**
   * @ignore
   */
  search$ = new BehaviorSubject<string>('');

  /**
   * @ignore
   */
  search = outputFromObservable(this.search$.pipe(skip(1), debounceTime(this.debounceTime())));

  /**
   * @ignore
   */
  clear(): void {
    const element = this.input().nativeElement;
    if (element.value === '') return;

    element.value = '';

    this.search$.next(element.value);
  }
}
