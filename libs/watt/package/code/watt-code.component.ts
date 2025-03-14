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
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  input,
  OnDestroy,
  inject,
  effect,
  linkedSignal,
} from '@angular/core';

import { WattSpinnerComponent } from '../spinner';
import { VaterStackComponent } from '../vater';

import { WATT_CODE_HIGHLIGHT_WORKER_FACTORY } from './watt-code.worker.token';

@Component({
  selector: 'watt-code',
  template: `
    @if (loading()) {
      <vater-stack [fill]="'horizontal'" [align]="'center'"><watt-spinner /></vater-stack>
    } @else {
      <pre>
        <code class="watt-code-content" [innerHTML]="formattedCode()"></code>
      </pre>
    }
  `,
  styleUrls: ['./watt-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [WattSpinnerComponent, VaterStackComponent],
})
export class WattCodeComponent implements OnDestroy {
  private highlightWorkerFactory = inject(WATT_CODE_HIGHLIGHT_WORKER_FACTORY);
  private worker = this.highlightWorkerFactory?.();

  code = input.required<string | null | undefined>();

  /** @ignore */
  formattedCode = linkedSignal(() => this.code() ?? '');

  /** @ignore */
  loading = signal(false);

  /** @ignore */
  ngOnDestroy(): void {
    this.worker?.terminate();
  }

  constructor() {
    effect(() => {
      const code = this.code();
      if (!code) return;
      if (!this.worker) return;
      this.loading.set(true);
      this.worker.onmessage = (event) => {
        this.formattedCode.set(event.data);
        this.loading.set(false);
      };
      this.worker.postMessage(code);
    });
  }
}
