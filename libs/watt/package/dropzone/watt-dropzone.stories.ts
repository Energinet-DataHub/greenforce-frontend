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
import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WattFieldErrorComponent, WattFieldHintComponent } from '../field';
import { WattDropZone } from './watt-dropzone';
import { limitFiles, maxFileSize } from './watt-dropzone-validators';

const meta: Meta<WattDropZone> = {
  title: 'Components/DropZone',
  component: WattDropZone,
  decorators: moduleMetadata({
    imports: [ReactiveFormsModule, WattFieldHintComponent, WattFieldErrorComponent],
  }),
};

export default meta;

export const Single: StoryFn<WattDropZone> = (args) => ({
  props: args,
  template: `
    <watt-dropzone
      label="Upload file"
      accept="text/csv,text/plain"
    />
  `,
});

export const Multiple: StoryFn<WattDropZone> = (args) => ({
  props: args,
  template: `
    <watt-dropzone
      multiple
      label="Upload files"
      accept="text/csv,text/plain"
    />
  `,
});

export const ReactiveForm: StoryFn<WattDropZone> = (args) => ({
  props: {
    ...args,
    exampleFormControl: new FormControl(null, maxFileSize(1000)),
  },
  template: `
    <watt-dropzone accept="text/csv" [formControl]="exampleFormControl" label="Upload file">
      <watt-field-hint>Supports CSV files less than 1KB</watt-field-hint>
      @if (exampleFormControl.errors?.type) {
        <watt-field-error>File must be in CSV format</watt-field-error>
      } @else if (exampleFormControl.errors?.size) {
        <watt-field-error>File must be less than 1KB</watt-field-error>
      }
    </watt-dropzone>
  `,
});

export const FileList: StoryFn<WattDropZone> = (args) => ({
  props: {
    ...args,
    exampleFormControl: new FormControl(null, limitFiles(5)),
  },
  template: `
    <watt-dropzone
      multiple
      [formControl]="exampleFormControl"
      label="Upload files"
    >
      <watt-field-hint>Limit of 5 files</watt-field-hint>
      @if (exampleFormControl.errors?.limit) {
        <watt-field-error>
          You may only select up to {{ exampleFormControl.errors?.limit }} files
        </watt-field-error>
      }
    </watt-dropzone>
    <ul>
      @for (file of exampleFormControl.value; track file.name) {
        <li>{{ file.name }} ({{ file.size / 1000 }} KB)</li>
      }
    </ul>
  `,
});
