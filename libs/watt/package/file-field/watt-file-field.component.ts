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
//#region License
/**
 * @license
 * Copyright 2024 Energinet DataHub A/S
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
import { Component, ViewEncapsulation, input, model, output } from '@angular/core';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattFieldComponent } from '@energinet/watt/field';

@Component({
  selector: 'watt-file-field',
  imports: [WattButtonComponent, WattFieldComponent],
  encapsulation: ViewEncapsulation.None,
  styles: `
    .watt-file-field-text {
      color: var(--watt-color-primary);
    }

    .watt-file-field-text:placeholder-shown {
      color: var(--watt-input-placeholder-color);
    }
  `,
  template: `
    <watt-field [label]="label()">
      <input
        disabled
        class="watt-file-field-text"
        [placeholder]="placeholder()"
        type="text"
        [value]="file()?.name"
      />
      @if (!file()) {
        <input #input hidden type="file" (change)="file.set(input.files?.item(0) ?? undefined)" />
        <watt-button variant="icon" icon="fileUpload" (click)="input.click()" />
      } @else {
        <watt-button variant="icon" icon="remove" (click)="clear.emit()" />
      }
      <ng-content />
    </watt-field>
  `,
})
export class WattFileField {
  readonly file = model<File>();
  readonly label = input('');
  readonly placeholder = input('');
  readonly clear = output();
  protected clearSubscription = this.clear.subscribe(() => this.file.set(undefined));
}
