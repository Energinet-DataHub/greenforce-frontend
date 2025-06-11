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
  booleanAttribute,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattFieldComponent } from '@energinet/watt/field';
import { VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import { WattDropZoneIntlService } from './watt-dropzone-intl';
import { FileTypeValidator, MultipleFilesValidator } from './watt-dropzone-validators';

// Slightly better typing than just raw string
export type MimeType = `${string}/${string}`;

@Component({
  imports: [
    ReactiveFormsModule,
    VaterStackComponent,
    VaterUtilityDirective,
    WattButtonComponent,
    WattFieldComponent,
  ],
  selector: 'watt-dropzone',
  hostDirectives: [MultipleFilesValidator, FileTypeValidator],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattDropZone),
      multi: true,
    },
  ],
  styles: `
    .wrapper {
      display: block;
      min-height: 184px; /* Magic UX number */
    }

    .dropzone {
      background: var(--watt-color-neutral-grey-200);
    }

    .dragOver {
      background: var(--watt-color-state-info-light);
    }
  `,
  template: `
    <watt-field [label]="label()">
      <ng-content />
      <ng-content select="watt-field-error" ngProjectAs="watt-field-error" />
      <ng-content select="watt-field-hint" ngProjectAs="watt-field-hint" />
      <span class="wrapper">
        <vater-stack
          inset="0"
          class="dropzone"
          [class.dragOver]="dragOver()"
          (dragover)="handleDragOver($event)"
          (drop)="handleDrop($event)"
          (drop)="dragOver.set(false)"
          (dragleave)="dragOver.set(false)"
        >
          <vater-stack center gap="xs">
            <input
              #input
              hidden
              type="file"
              [multiple]="multiple()"
              [accept]="accept().join(',')"
              (change)="handleFiles(input.files)"
            />
            <span>{{ multiple() ? intl.promptMultiple : intl.prompt }}</span>
            <span class="watt-on-light--medium-emphasis">{{ intl.separator }}</span>
            <watt-button size="small" variant="secondary" (click)="input.click()">
              {{ multiple() ? intl.buttonMultiple : intl.button }}
            </watt-button>
          </vater-stack>
        </vater-stack>
      </span>
    </watt-field>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class WattDropZone implements ControlValueAccessor {
  intl = inject(WattDropZoneIntlService);

  /** Whether the dropzone should accept multiple files. */
  multiple = input(false, { transform: booleanAttribute });

  /** Label for the dropzone. */
  label = input<string>();

  /** Comma-separated list of MIME types that the dropzone accepts. */
  accept = input([], { transform: (value: MimeType) => value.split(',') as MimeType[] });

  /** Emits when one or more files are selected. */
  selected = output<File[]>();

  // Tracks (valid) drag over state
  dragOver = signal(false);

  handleFiles(files: FileList | null) {
    if (!files) return;
    this.selected.emit(Array.from(files));
  }

  handleDrop(event: DragEvent) {
    if (!event.dataTransfer) return;
    if (!this.dragOver()) return;

    // Prevent opening the file in the browser
    event.preventDefault();

    this.handleFiles(event.dataTransfer.files);
  }

  handleDragOver(event: DragEvent) {
    if (!event.dataTransfer) return;

    // Ignore non-file items such as strings
    if (Array.from(event.dataTransfer.items).some((i) => i.kind !== 'file')) return;

    // Prevent opening the file in the browser
    event.preventDefault();

    this.dragOver.set(true);
  }

  // Implementation for ControlValueAccessor
  writeValue = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  registerOnTouched = (fn: () => void) => this.selected.subscribe(fn);
  registerOnChange = (fn: (value: File[]) => void) => this.selected.subscribe(fn);
}
