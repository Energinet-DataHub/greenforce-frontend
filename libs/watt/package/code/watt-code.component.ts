//#region License
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
//#endregion
import {
  input,
  output,
  signal,
  inject,
  effect,
  computed,
  viewChild,
  Component,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { VaterStackComponent } from '@energinet/watt/vater';
import { WattSearchComponent } from '@energinet/watt/search';
import { WattSpinnerComponent } from '@energinet/watt/spinner';

import { WattCodeIntlService } from './watt-code-intl.service';
import { WATT_CODE_HIGHLIGHT_WORKER_FACTORY } from './watt-code.worker.token';

@Component({
  selector: 'watt-code',
  template: `
    @if (loading()) {
      <vater-stack fill="horizontal" align="center">
        <watt-spinner />
      </vater-stack>
    } @else {
      <watt-search
        size="m"
        [label]="intl.searchPlaceholder"
        (search)="searchTerm.set($event)"
        (keyup.enter)="searchNext()"
      />
      <pre>
        <cdk-virtual-scroll-viewport 
          [itemSize]="20" 
          minBufferPx="500"
          maxBufferPx="1000"
          class="viewport" 
          style="height: 100%; width: 100%;">
           <code *cdkVirtualFor="let item of chunks(); let i = index; trackBy: trackByFn" 
                [attr.data-index]="i"
                [innerHTML]="item" 
                [class.highlight]="isLineHighlighted(i)"></code>
        </cdk-virtual-scroll-viewport>
      </pre>
    }
  `,
  styleUrls: ['./watt-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [WattSpinnerComponent, VaterStackComponent, ScrollingModule, WattSearchComponent],
})
export class WattCodeComponent implements OnDestroy {
  private highlightWorkerFactory = inject(WATT_CODE_HIGHLIGHT_WORKER_FACTORY);
  private worker = this.highlightWorkerFactory?.();
  intl = inject(WattCodeIntlService);

  viewport = viewChild.required(CdkVirtualScrollViewport);

  code = input.required<string | null | undefined>();
  language = input<'xml' | 'json' | 'auto'>('auto');

  /** @ignore */
  formattedCode = signal<string>('');
  /** @ignore */
  loading = signal(false);

  discoveredLanguage = output<'json' | 'xml'>();

  // Search functionality
  searchTerm = signal('');
  matchIndices = signal<number[]>([]);
  currentMatchIndex = signal<number>(-1);

  chunks = computed(() => {
    const code = this.formattedCode();
    if (!code) return [''];
    const lines = code.split('\n');
    return lines.length === 0 ? [''] : lines;
  });

  constructor() {
    effect(() => {
      const code = this.code();
      this.formattedCode.set('');

      if (!code) return;
      if (!this.worker) return;
      this.loading.set(true);
      this.worker.onmessage = (event) => {
        const { formattedData, discoveredLanguage } = event.data;
        this.formattedCode.set(formattedData);
        this.discoveredLanguage.emit(discoveredLanguage);
        this.loading.set(false);
      };
      this.worker.postMessage({ data: code, language: this.language() } as const);
    });

    effect(() => {
      const term = this.searchTerm();

      if (!term) return;

      const newMatchIndices = this.chunks()
        .map((chunk, index) => (chunk.toLowerCase().includes(term.toLowerCase()) ? index : -1))
        .filter((index) => index !== -1);

      this.matchIndices.set(newMatchIndices);
      if (newMatchIndices.length > 0 && this.currentMatchIndex() === -1) {
        this.currentMatchIndex.set(0);
      } else if (newMatchIndices.length === 0) {
        this.currentMatchIndex.set(-1);
      }
    });
  }

  isLineHighlighted(index: number): boolean {
    const matchIndex = this.currentMatchIndex();
    if (matchIndex === -1) return false;
    return this.matchIndices()[matchIndex] === index;
  }

  searchNext(): void {
    const viewport = this.viewport();
    const matches = this.matchIndices();
    if (matches.length === 0) return;

    let nextIndex = this.currentMatchIndex() + 1;
    if (nextIndex >= matches.length) {
      nextIndex = 0;
    }

    this.currentMatchIndex.set(nextIndex);

    const lineIndex = matches[nextIndex];
    if (lineIndex !== undefined) {
      viewport.scrollToIndex(lineIndex);
    }
  }

  trackByFn(index: number): number {
    return index;
  }

  /** @ignore */
  ngOnDestroy(): void {
    this.worker?.terminate();
  }
}
