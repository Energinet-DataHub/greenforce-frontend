import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import {
  WattFieldComponent,
  WattFieldErrorComponent,
  WattFieldHintComponent,
} from '@energinet-datahub/watt/field';
import { WattPhoneFieldComponent } from '../watt-phone-field.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

const meta: Meta<WattPhoneFieldComponent> = {
  title: 'Components/Phone Field',
  component: WattPhoneFieldComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        WattFieldComponent,
        WattFieldErrorComponent,
        WattFieldHintComponent,
      ],
    }),
    applicationConfig({
      providers: [provideAnimations(), importProvidersFrom(HttpClientModule)],
    }),
  ],
};

export default meta;

export const Default: StoryFn<WattPhoneFieldComponent> = () => ({
  props: {
    label: 'Phone number',
    exampleFormControl: new FormControl(null),
  },
  template: `<watt-phone-field [label]="label" [control]="exampleFormControl" />`,
});

export const WithRequired: StoryFn<WattPhoneFieldComponent> = () => ({
  props: {
    label: 'Required Phone number',
    exampleFormControl: new FormControl(null, Validators.required),
  },
  template: `<watt-phone-field [label]="label" [control]="exampleFormControl" />`,
});

export const WithHint: StoryFn<WattPhoneFieldComponent> = () => ({
  props: {
    label: 'Phone number with hint',
    exampleFormControl: new FormControl(null, Validators.required),
  },
  template: `<watt-phone-field [label]="label" [control]="exampleFormControl">
              <watt-field-hint>This is a hint</watt-field-hint>
            </watt-phone-field>`,
});
