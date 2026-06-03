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
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { render } from '@testing-library/angular';

import {
  WattFieldErrorComponent,
  WattFieldHintComponent,
  WattFieldWarningComponent,
} from '@energinet/watt/field';
import { WattFileField } from '@energinet/watt/file-field';
import { WATT_RADIO } from '@energinet/watt/radio';

describe('Watt field layout regressions', () => {
  it('projects file-field messages below the input wrapper', async () => {
    const { container } = await render(
      `<watt-file-field placeholder="Select file">
        <watt-field-hint>Hint</watt-field-hint>
        <watt-field-error>Error</watt-field-error>
        <watt-field-warning>Warning</watt-field-warning>
      </watt-file-field>`,
      {
        imports: [
          WattFileField,
          WattFieldHintComponent,
          WattFieldErrorComponent,
          WattFieldWarningComponent,
        ],
      }
    );

    const wrapper = container.querySelector('.watt-field-wrapper');
    const messages = container.querySelectorAll(
      'watt-field-hint, watt-field-error, watt-field-warning'
    );

    expect(messages).toHaveLength(3);
    messages.forEach((message) => {
      expect(wrapper?.contains(message)).toBe(false);
      expect(message.parentElement?.matches('label, .watt-label')).toBe(true);
    });
  });

  it('projects radio-group messages below the radio options wrapper', async () => {
    @Component({
      imports: [
        ReactiveFormsModule,
        WATT_RADIO,
        WattFieldHintComponent,
        WattFieldErrorComponent,
        WattFieldWarningComponent,
      ],
      template: `
        <watt-radio-group label="Best Framework" [formControl]="control">
          <watt-radio value="angular">Angular</watt-radio>
          <watt-radio value="react">React</watt-radio>
          <watt-field-hint>Hint</watt-field-hint>
          <watt-field-error>Error</watt-field-error>
          <watt-field-warning>Warning</watt-field-warning>
        </watt-radio-group>
      `,
    })
    class TestComponent {
      control = new FormControl('angular');
    }

    const { container } = await render(TestComponent);

    const wrapper = container.querySelector('.watt-field-wrapper');
    const messages = container.querySelectorAll(
      'watt-field-hint, watt-field-error, watt-field-warning'
    );

    expect(messages).toHaveLength(3);
    messages.forEach((message) => {
      expect(wrapper?.contains(message)).toBe(false);
      expect(message.parentElement?.matches('label, .watt-label')).toBe(true);
    });
  });
});
