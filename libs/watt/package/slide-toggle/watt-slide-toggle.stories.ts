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
import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';

import { WattSlideToggle } from './watt-slide-toggle.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

const meta: Meta<WattSlideToggle> = {
  title: 'Components/Slide Toggle',
  component: WattSlideToggle,
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, WattSlideToggle],
    }),
  ],
};

export default meta;

const SlideToggleStory: StoryFn<WattSlideToggle> = (args) => ({
  props: args,
  template: `<watt-slide-toggle>Toggle me</watt-slide-toggle>`,
});

export const SlideToggle = SlideToggleStory.bind({});
SlideToggle.args = {};

export const WithFormControl: StoryFn<WattSlideToggle> = () => ({
  props: {
    exampleFormControl: new FormControl(false),
  },
  template: `
    <watt-slide-toggle [formControl]="exampleFormControl">Filter something</watt-slide-toggle>
    <p>Value: <code>{{ exampleFormControl.value | json }}</code></p>
  `,
});
