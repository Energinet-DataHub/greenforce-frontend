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
import { Directive, inject } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { WattDropZone, MimeType } from './watt-dropzone';

/**
 * Directive that validates the file type of provided files. This is automatically
 * applied to the `WattDropZone` component via `hostDirectives`.
 */
@Directive({
  providers: [{ provide: NG_VALIDATORS, useExisting: FileTypeValidator, multi: true }],
})
export class FileTypeValidator implements Validator {
  component = inject(WattDropZone, { host: true, self: true });
  validate(control: AbstractControl<File[] | null>): ValidationErrors | null {
    const accept = this.component.accept();
    return accept.length > 0 && control.value?.some((i) => !accept.includes(i.type as MimeType))
      ? { type: true }
      : null;
  }
}

/**
 * Directive validating that a single file is selected when `multiple` is false.
 * This is automatically applied to the `WattDropZone` component via `hostDirectives`.
 */
@Directive({
  providers: [{ provide: NG_VALIDATORS, useExisting: MultipleFilesValidator, multi: true }],
})
export class MultipleFilesValidator implements Validator {
  component = inject(WattDropZone, { host: true, self: true });
  validate(control: AbstractControl<File[] | null>): ValidationErrors | null {
    const multiple = this.component.multiple();
    return !multiple && control.value?.length !== 1 ? { multiple: true } : null;
  }
}

/** Validates that the file size is less than or equal to the specified maximum size. */
export const limitFiles =
  (limit: number) =>
  (control: AbstractControl<File[] | null>): ValidationErrors | null =>
    control.value?.length && control.value.length > limit ? { limit } : null;

/** Validates that the file size is less than or equal to the specified maximum size. */
export const maxFileSize =
  (size: number) =>
  (control: AbstractControl<File[] | null>): ValidationErrors | null =>
    control.value?.some((file) => file.size > size) ? { size } : null;
