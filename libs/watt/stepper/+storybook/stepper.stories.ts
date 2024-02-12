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
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import { StepperExampleComponent } from './stepper.example.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
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
