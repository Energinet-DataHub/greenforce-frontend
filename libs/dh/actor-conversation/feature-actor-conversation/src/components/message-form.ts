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
  ElementRef,
  computed,
  effect,
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
import { WattFieldHintComponent, WattFieldErrorComponent } from '@energinet/watt/field';
import { WattInputChipComponent } from '@energinet/watt/chip';

const allowedFileExtensions = ['.bmp', '.csv', '.jpeg', '.jpg', '.pdf', '.png', '.txt'];
const maxFileSizeBytes = 25 * 1024 * 1024; // 25 MB

@Component({
  selector: 'dh-actor-conversation-message-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DhActorConversationMessageForm),
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
    WattFieldErrorComponent,
  ],
  styles: `
    .info-icon-color {
      color: var(--watt-text-color);
    }

    .file-input {
      display: none;
    }

    .field-hint {
      display: block !important;
      margin-top: var(--watt-space-xs);
    }
  `,
  template: `
    <vater-stack
      fill="horizontal"
      align="end"
      gap="s"
      *transloco="let t; prefix: 'meteringPoint.actorConversation'"
    >
      <watt-textarea-field
        [formControl]="form.controls.message"
        [small]="true"
        data-testid="actor-conversation-message-textarea"
        (keydown)="onKeyDown($event)"
      >
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

        @if (showAttachmentsError()) {
          <watt-field-error>
            {{ t('numberOfRequiredAttachments', { count: numberOfRequiredAttachments() }) }}
          </watt-field-error>
        }

        <watt-field-hint class="watt-text-s field-hint">
          {{ t('personalDataNoticePrefix') }}
          <a
            class="watt-link-s"
            target="_blank"
            href="https://www.datatilsynet.dk/regler-og-vejledning/grundlaeggende-begreber/hvad-er-personoplysninger"
          >
            {{ t('personalDataNoticeLink') }}</a
          >{{ t('personalDataNoticeMidfix') }}
          <strong class="watt-text-s-highlighted">{{ t('personalDataNoticeNot') }}</strong
          >{{ t('personalDataNoticeSuffix') }}
        </watt-field-hint>
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
export class DhActorConversationMessageForm implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly elementRef = inject(ElementRef);
  loading = input<boolean>(false);
  closed = input<boolean>(false);
  disableAnonymous = input<boolean>(false);
  uploadError = input<boolean>(false);
  numberOfRequiredAttachments = input<number>(0);

  form = new FormGroup({
    message: new FormControl<string | null>(null),
    anonymous: new FormControl<boolean>(false),
  });

  showAttachmentsError = computed(
    () => this.selectedFiles().length < this.numberOfRequiredAttachments()
  );

  selectedFiles = signal<File[]>([]);
  hasInvalidFileType = signal(false);
  hasOversizedFile = signal(false);
  acceptedFileTypes = allowedFileExtensions.join(',');

  value = toSignal(this.form.valueChanges);

  disableAnonymousControlEffect = effect(() => {
    if (this.disableAnonymous()) {
      this.form.controls.anonymous.setValue(false);
      this.form.controls.anonymous.disable({ emitEvent: false });
    } else {
      this.form.controls.anonymous.enable({ emitEvent: false });
    }
  });

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

  onKeyDown(event: KeyboardEvent): void {
    if ((event.key === 'Enter' && event.ctrlKey) || (event.key === 'Enter' && event.metaKey)) {
      const form = (this.elementRef.nativeElement as HTMLElement).closest('form');
      form?.requestSubmit();
    }
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
  setDisabledState = (disabled: boolean) =>
    disabled ? this.form.disable({ emitEvent: false }) : this.form.enable({ emitEvent: false });
}
