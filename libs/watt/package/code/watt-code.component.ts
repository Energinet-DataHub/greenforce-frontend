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
  signal,
  inject,
  effect,
  computed,
  Component,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

import { ScrollingModule } from '@angular/cdk/scrolling';

import { VaterStackComponent } from '@energinet/watt/vater';
import { WattSpinnerComponent } from '@energinet/watt/spinner';

import { WATT_CODE_HIGHLIGHT_WORKER_FACTORY } from './watt-code.worker.token';

@Component({
  selector: 'watt-code',
  template: `
    @if (loading()) {
      <vater-stack fill="horizontal" align="center"><watt-spinner /></vater-stack>
    } @else {
      <pre>
        <cdk-virtual-scroll-viewport 
          [itemSize]="20" 
          minBufferPx="500"
          maxBufferPx="1000"
          class="viewport" 
          style="height: 100%; width: 100%;">
           <code *cdkVirtualFor="let item of chunks(); track: index" [innerHTML]="item"></code>
        </cdk-virtual-scroll-viewport>
      </pre>
    }
  `,
  styleUrls: ['./watt-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [WattSpinnerComponent, VaterStackComponent, ScrollingModule],
})
export class WattCodeComponent implements OnDestroy {
  private highlightWorkerFactory = inject(WATT_CODE_HIGHLIGHT_WORKER_FACTORY);
  private worker = this.highlightWorkerFactory?.();

  code = input.required<string | null | undefined>();

  language = input<'xml' | 'json'>('xml');

  /** @ignore */
  formattedCode = signal<string>('');
  /** @ignore */
  loading = signal(false);

  chunks = computed(() => {
    const code = this.formattedCode();
    if (!code) return [''];
    const lines = code.split('\n');
    return lines.length === 0 ? [''] : lines;
  });

  trackByFn(index: number): number {
    return index;
  }

  /** @ignore */
  ngOnDestroy(): void {
    this.worker?.terminate();
  }

  constructor() {
    effect(() => {
      const code = this.code();
      this.formattedCode.set('');

      if (!code) return;
      if (!this.worker) return;
      this.loading.set(true);
      this.worker.onmessage = (event) => {
        this.formattedCode.set(event.data);
        this.loading.set(false);
      };
      this.worker.postMessage({ data: code, language: this.language() } as const);
    });
  }
}
