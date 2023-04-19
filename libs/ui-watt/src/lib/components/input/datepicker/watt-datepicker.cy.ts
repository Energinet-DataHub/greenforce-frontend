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
