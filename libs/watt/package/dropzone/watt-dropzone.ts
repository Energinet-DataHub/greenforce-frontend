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
import { Component, input, signal } from '@angular/core';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattFieldComponent } from '@energinet/watt/field';
import { VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';

@Component({
  imports: [VaterStackComponent, VaterUtilityDirective, WattButtonComponent, WattFieldComponent],
  selector: 'watt-dropzone',
  styles: `
    .wrapper {
      min-width: 674px;
      min-height: 184px;
    }

    .dropzone {
      background: #eeeeee;
    }

    .drag-over {
      background: var(--watt-color-primary-light);
    }

    .medium-emphasis {
      color: var(--watt-on-light-medium-emphasis);
    }

    input[type='file'] {
      display: none;
    }
  `,
  template: `
    <watt-field label="Indlæs CSV fil">
      <span #span class="wrapper">
        <vater-stack
          inset="0"
          class="dropzone"
          [class.drag-over]="dragOver()"
          (drop)="dropHandler($event)"
          (dragover)="dragOverHandler($event)"
          (dragover)="dragOver.set(true)"
          (dragleave)="dragOver.set(false)"
          (drop)="dragOver.set(false)"
        >
          <vater-stack center gap="xs">
            <input
              #input
              type="file"
              [accept]="accept()"
              (change)="onFileSelected($event, input.files)"
            />
            <span>Træk fil hertil</span>
            <span class="medium-emphasis">eller</span>
            <watt-button size="small" variant="secondary" (click)="input.click()">
              Vælg fil
            </watt-button>
          </vater-stack>
        </vater-stack>
      </span>
    </watt-field>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class WattDropZone {
  accept = input<string>();

  dragOver = signal(false);

  onFileSelected(x: any, y: any) {
    console.log(x);
    console.log(y);
  }

  dropHandler(ev: any) {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === 'file') {
          const file = item.getAsFile();
          console.log(`… file[${i}].name = ${file.name}`);
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...ev.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
      });
    }
  }

  dragOverHandler(ev: any) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }
}
