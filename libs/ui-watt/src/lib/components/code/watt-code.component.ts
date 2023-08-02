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
import { Component, ChangeDetectionStrategy, Input, ViewEncapsulation } from '@angular/core';
import { HighlightModule } from 'ngx-highlightjs';

type languages = 'xml' | 'json';

@Component({
  selector: 'watt-code',
  template: `
    <pre>
        <code [highlight]="code" [lineNumbers]="lineNumbers" [languages]="languages"></code>
      </pre>
  `,
  styleUrls: ['./watt-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [HighlightModule],
})
export class WattCodeComponent {
  @Input() code: string | null = null;
  @Input() languages!: languages[];
  @Input() lineNumbers!: boolean;
}
