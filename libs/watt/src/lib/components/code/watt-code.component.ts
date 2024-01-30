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
  Input,
  ViewEncapsulation,
  OnInit,
  signal,
} from '@angular/core';

@Component({
  selector: 'watt-code',
  template: `
    <pre>
        <code>{{ formattedCode() }}</code>
      </pre>
  `,
  styleUrls: ['./watt-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class WattCodeComponent implements OnInit {
  @Input({ required: true }) code: string | null = null;
  @Input() lineNumbers = true;

  formattedCode = signal<string>('');

  ngOnInit(): void {
    const worker = new Worker(new URL('./watt-code.worker.ts', import.meta.url));
    worker.onmessage = (event) => {
      this.formattedCode.set(event.data);
    };
    worker.postMessage(this.code);
  }
}
