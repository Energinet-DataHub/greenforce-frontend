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
import { ReactiveFormsModule } from '@angular/forms';
import { WattFormFieldModule } from '../../form-field';
import { WattDatepickerModule } from './watt-datepicker.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StorybookConfigurationLocalizationModule } from '../+storybook/storybook-configuration-localization.module';

import { CommonModule } from '@angular/common';
import Meta, { WithFormControl } from './+storybook/watt-datepicker-reactive-forms.stories';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WithFormControlStory = (WithFormControl as any).render({});

beforeEach(() => {
  console.log(Meta);
  cy.mount(WithFormControlStory.template, {
    componentProperties: WithFormControlStory.props,
    imports: [
      BrowserAnimationsModule,
      StorybookConfigurationLocalizationModule.forRoot(),
      ReactiveFormsModule,
      CommonModule,
      WattFormFieldModule,
      WattDatepickerModule,
    ],
  });
});

it('should mount', () => {
  cy.findByRole('textbox', {
    name: /^date-input/i,
  }).type('22-02-2222');
});
