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

// Slightly better typing than just raw string
type MimeType = `${string}/${string}`;

@Component({
  imports: [
    ReactiveFormsModule,
    VaterStackComponent,
    VaterUtilityDirective,
    WattButtonComponent,
    WattFieldComponent,
  ],
  selector: 'watt-dropzone',
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

    .accepted {
      background: var(--watt-color-state-success-light);
    }

    .rejected {
      background: var(--watt-color-state-danger-light);
    }

    .medium-emphasis {
      color: var(--watt-on-light-medium-emphasis);
    }

    input[type='file'] {
      display: none;
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
          [class]="acceptState()"
          (dragover)="handleDragOver($event)"
          (drop)="handleDrop($event)"
          (drop)="acceptState.set('indeterminate')"
          (dragleave)="acceptState.set('indeterminate')"
        >
          <vater-stack center gap="xs">
            <input
              #input
              type="file"
              [multiple]="multiple()"
              [accept]="accept().join(',')"
              (change)="handleFiles(input.files)"
            />
            <span>{{ multiple() ? intl.promptMultiple : intl.prompt }}</span>
            <span class="medium-emphasis">{{ intl.separator }}</span>
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
  acceptState = signal<'indeterminate' | 'accepted' | 'rejected'>('indeterminate');

  /** Emits when one or more files are selected. */
  selected = output<File[]>();

  handleFiles(files: FileList | null) {
    if (files) {
      this.selected.emit(Array.from(files));
    }
  }

  handleDrop(event: DragEvent) {
    if (!event.dataTransfer) return;
    if (this.acceptState() === 'indeterminate') return;

    // Prevent opening the file in the browser
    event.preventDefault();

    if (this.acceptState() === 'accepted') {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  handleDragOver(event: DragEvent) {
    if (!event.dataTransfer) return;

    const items = Array.from(event.dataTransfer.items);
    const accept = this.accept();

    // Ignore non-file items such as strings
    if (items.some((i) => i.kind !== 'file')) return;

    // Prevent opening the file in the browser
    event.preventDefault();

    switch (true) {
      case !this.multiple() && items.length > 1:
      case accept.length > 0 && items.some((i) => !accept.includes(i.type as MimeType)):
        this.acceptState.set('rejected');
        return;
      default:
        this.acceptState.set('accepted');
        return;
    }
  }

  // Implementation for ControlValueAccessor
  writeValue = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  registerOnTouched = (fn: () => void) => this.selected.subscribe(fn);
  registerOnChange = (fn: (value: File[]) => void) => this.selected.subscribe(fn);
}
