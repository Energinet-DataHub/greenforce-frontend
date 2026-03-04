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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattIconComponent } from '@energinet/watt/icon';
import {
  WattTextAreaFieldComponent,
  WattTextareaNoticeComponent,
} from '@energinet/watt/textarea-field';
import { TranslocoDirective } from '@jsverse/transloco';
import { WattCheckboxComponent } from '@energinet/watt/checkbox';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
import { MessageFormValue } from '../types';
import { skip } from 'rxjs';
import { WattFieldHintComponent } from '@energinet/watt/field';
import { WattInputChipComponent } from '@energinet/watt/chip';

const allowedFileExtensions = ['.bmp', '.csv', '.jpeg', '.jpg', '.pdf', '.png', '.txt'];
const maxFileSizeBytes = 25 * 1024 * 1024; // 25 MB

@Component({
  selector: 'dh-actor-conversation-message-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DhActorConversationMessageFormComponent),
      multi: true,
    },
  ],
  imports: [
    VaterStackComponent,
    WattButtonComponent,
    WattIconComponent,
    WattTextAreaFieldComponent,
    TranslocoDirective,
    ReactiveFormsModule,
    WattCheckboxComponent,
    WattTooltipDirective,
    WattTextareaNoticeComponent,
    WattFieldHintComponent,
    WattInputChipComponent,
  ],
  styles: `
    .info-icon-color {
      color: var(--watt-text-color);
    }

    .file-input {
      display: none;
    }

    .file-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .file-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 16px;
      background: var(--watt-color-neutral-grey-200);
      font-size: 12px;
    }

    .file-chip watt-icon {
      cursor: pointer;
    }
  `,
  template: `
    <vater-stack
      fill="horizontal"
      align="end"
      *transloco="let t; prefix: 'meteringPoint.actorConversation'"
    >
      <watt-textarea-field
        [formControl]="form.controls.message"
        [small]="true"
        data-testid="actor-conversation-message-textarea">
        @if (closed()) {
          <watt-textarea-notice
            ><watt-icon name="info" state="default" />{{ t('closedNotice') }}</watt-textarea-notice
          >
        }
        @if (hasInvalidFileType()) {
          <watt-textarea-notice type="danger">
            <watt-icon name="warning" />{{ t('invalidFileType') }}
          </watt-textarea-notice>
        }
        @if (hasOversizedFile()) {
          <watt-textarea-notice type="danger">
            <watt-icon name="warning" />{{ t('fileTooLarge') }}
          </watt-textarea-notice>
        }
        @if (uploadError()) {
          <watt-textarea-notice type="danger">
            <watt-icon name="warning" />{{ t('uploadError') }}
          </watt-textarea-notice>
        }

        @for (file of selectedFiles(); track file.name) {
          <watt-input-chip [label]="file.name" (removed)="removeFile(file)" />
        }

        <watt-field-hint [innerHTML]="t('personalDataNotice')" style="display: block !important;" />
      </watt-textarea-field>

      <vater-stack direction="row" justify="space-between" fill="horizontal">
        <!-- File upload -->
        <input
          #fileInput
          type="file"
          multiple
          class="file-input"
          [accept]="acceptedFileTypes"
          (change)="onFilesSelected($event)"
        />
        <watt-button variant="secondary" (click)="fileInput.click()">
          <watt-icon name="attachFile" />
          {{ t('attachFileButton') }}
        </watt-button>
        <!-- End of file upload -->
        <vater-stack direction="row" gap="m">
          <vater-stack direction="row" gap="xs">
            <watt-checkbox [formControl]="form.controls.anonymous">
              {{ t('anonymousCheckbox') }}
            </watt-checkbox>
            <watt-icon
              name="info"
              size="s"
              class="info-icon-color"
              [wattTooltip]="t('anonymousTooltip')"
              wattTooltipPosition="top-start"
            />
          </vater-stack>
          <watt-button [loading]="loading()" type="submit">
            {{ t('sendButton') }}
            <watt-icon name="send" />
          </watt-button>
        </vater-stack>
      </vater-stack>
    </vater-stack>
  `,
})
export class DhActorConversationMessageFormComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);
  loading = input<boolean>(false);
  closed = input<boolean>(false);
  uploadError = input<boolean>(false);

  form = new FormGroup({
    message: new FormControl<string | null>(null),
    anonymous: new FormControl<boolean>(false),
  });

  selectedFiles = signal<File[]>([]);
  hasInvalidFileType = signal(false);
  hasOversizedFile = signal(false);
  acceptedFileTypes = allowedFileExtensions.join(',');

  value = toSignal(this.form.valueChanges);

  messageValueChanged = toObservable(
    computed<MessageFormValue>(() => {
      const value = this.value();
      const files = this.selectedFiles();

      return {
        content: value?.message ?? '',
        anonymous: value?.anonymous ?? false,
        files,
      };
    })
  );

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);

    const invalidType = files.filter((file) => !this.isAllowedFileType(file));
    this.hasInvalidFileType.set(invalidType.length > 0);

    const validType = files.filter((file) => this.isAllowedFileType(file));
    const oversized = validType.filter((file) => file.size > maxFileSizeBytes);
    this.hasOversizedFile.set(oversized.length > 0);

    const accepted = validType.filter((file) => file.size <= maxFileSizeBytes);
    if (accepted.length > 0) {
      this.selectedFiles.update((current) => [...current, ...accepted]);
    }

    input.value = '';
  }

  removeFile(file: File): void {
    this.selectedFiles.update((current) => current.filter((f) => f !== file));
  }

  private isAllowedFileType(file: File): boolean {
    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    return allowedFileExtensions.includes(extension);
  }

  // Implementation for ControlValueAccessor
  writeValue(value: MessageFormValue | null): void {
    if (value) {
      this.form.setValue(
        { message: value.content, anonymous: value.anonymous ?? false },
        { emitEvent: false }
      );
      this.selectedFiles.set(value.files ?? []);
    } else {
      this.form.reset({ message: null, anonymous: false }, { emitEvent: false });
      this.selectedFiles.set([]);
    }
    this.cdr.markForCheck();
  }

  registerOnChange = (fn: (value: MessageFormValue | null) => void) =>
    this.messageValueChanged.subscribe(fn);
  registerOnTouched = (fn: () => void) => this.form.valueChanges.pipe(skip(1)).subscribe(fn);
  setDisabledState = (disabled: boolean) => (disabled ? this.form.disable() : this.form.enable());
}
