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
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';

import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import { createWorker } from './watt-code.worker-factory';

@Component({
  selector: 'watt-code',
  template: `
    @if (loading()) {
      <vater-stack [fill]="'horizontal'" [align]="'center'"><watt-spinner /></vater-stack>
    } @else {
      <pre>
        <code class="hljs" [innerHTML]="formattedCode()"></code>
      </pre>
    }
  `,
  styleUrls: ['./watt-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [WattSpinnerComponent, VaterStackComponent],
  standalone: true,
})
export class WattCodeComponent implements OnDestroy, OnChanges {
  code = input.required<string | null | undefined>();

  /** @ignore */
  formattedCode = signal<string>('');
  /** @ignore */
  loading = signal<boolean>(false);

  private _worker: Worker = createWorker();

  /** @ignore */
  ngOnDestroy(): void {
    this._worker.terminate();
  }

  /** @ignore */
  ngOnChanges(changes: SimpleChanges): void {
    const { currentValue } = changes['code'];

    if (currentValue === undefined || currentValue === null) {
      this.formattedCode.set('');
      this.loading.set(false);
      return;
    }

    this._worker.onmessage = (event) => {
      this.formattedCode.set(event.data);
      this.loading.set(false);
    };

    this._worker.postMessage(currentValue);
    this.loading.set(true);
  }
}
