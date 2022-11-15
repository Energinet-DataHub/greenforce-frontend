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
import Meta, { Overview } from './+storybook/watt-tooltip.stories';
import userEvent from '@testing-library/user-event';

const Story = composeStory(Overview, Meta);

async function setup() {
  const { component, ngModule } = createMountableStoryComponent(
    Story({}, {} as never)
  );

  return render(component, { imports: [ngModule] });
}

describe(WattTooltipDirective.name, () => {
  const getTooltip = () => screen.getByText('Click me');
  const getTooltipTarget = () => screen.getByText('Button');

  const isTooltipVisible = (): boolean =>
    getTooltip().classList.contains('show');

  it('always displays accessible tooltip', async () => {
    await setup();
    expect(screen.getAllByRole('tooltip')[0]).toBeInTheDocument();
  });

  it('displays tooltip on hover', async () => {
    await setup();
    expect(isTooltipVisible()).toBe(false);

    userEvent.hover(getTooltipTarget());
    expect(isTooltipVisible()).toBe(true);
  });

  it('hides tooltip on unhover', async () => {
    await setup();
    userEvent.hover(getTooltipTarget());
    expect(isTooltipVisible()).toBe(true);

    userEvent.unhover(getTooltipTarget());
    expect(isTooltipVisible()).toBe(false);
  });

  it('displays tooltip on focus', async () => {
    await setup();
    expect(isTooltipVisible()).toBe(false);

    userEvent.tab();

    expect(isTooltipVisible()).toBe(true);
  });

  it('hides tooltip on blur', async () => {
    await setup();
    userEvent.tab();
    expect(isTooltipVisible()).toBe(true);

    userEvent.tab();

    expect(isTooltipVisible()).toBe(false);
  });
});
