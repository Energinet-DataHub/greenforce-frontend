import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import { StepperExampleComponent } from './stepper.example.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WattButtonComponent } from '../../button/watt-button.component';
import { WATT_MODAL } from '../../modal/watt-modal.component';
import { WattTooltipDirective } from '../../tooltip/watt-tooltip.directive';
import { WattTextFieldComponent } from '../../text-field/watt-text-field.component';
import { StepperModalExampleComponent } from './stepper.modal.example.component';

const meta: Meta<StepperExampleComponent> = {
  title: 'Components/Stepper',
  component: StepperExampleComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        WattButtonComponent,
        WATT_MODAL,
        WattTooltipDirective,
        WattTextFieldComponent,
        StepperModalExampleComponent,
      ],
    }),
  ],
};

export default meta;

const template = `<watt-stepper-example></watt-stepper-example>`;

export const Stepper: StoryFn = (args) => ({
  props: args,
  template,
});

export const Modal: StoryFn = (args) => ({
  props: args,
  template: `<watt-stepper-modal-example></watt-stepper-modal-example>`,
});

Stepper.parameters = {
  docs: {
    source: {
      code: template,
    },
  },
};
