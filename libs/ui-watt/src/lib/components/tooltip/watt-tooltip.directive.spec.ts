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
import { render, screen } from '@testing-library/angular';
import {
  composeStory,
  createMountableStoryComponent,
} from '@storybook/testing-angular';

import { WattTooltipDirective } from './watt-tooltip.directive';
import Meta, { Overview } from './watt-tooltip.stories';
import userEvent from '@testing-library/user-event';

const Story = composeStory(Overview, Meta);

async function setup() {
  const { component, ngModule } = createMountableStoryComponent(
    Story({}, {} as never)
  );

  return render(component, { imports: [ngModule] });
}

describe(WattTooltipDirective.name, () => {
  it('always displays accessible tooltip', async () => {
    await setup();
    expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
  });

  it('displays tooltip on hover', async () => {
    await setup();
    userEvent.hover(screen.getByRole('button'));
    expect(screen.getByText('Click me', { ignore: '[role]' })).toBeVisible();
  });
});
