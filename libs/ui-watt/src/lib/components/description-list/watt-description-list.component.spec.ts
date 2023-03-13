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
import { composeStory, createMountableStoryComponent } from '@storybook/testing-angular';
import { render, screen } from '@testing-library/angular';
import { Story } from '@storybook/angular';

import { WattDescriptionListComponent } from './watt-description-list.component';
import Meta, { Default } from './+storybook/watt-description-list.stories';

const defaultStory = composeStory(Default, Meta);

describe(WattDescriptionListComponent.name, () => {
  async function setup(story: Story, clickSpy?: unknown) {
    const { component, ngModule } = createMountableStoryComponent(
      story({ onClick: clickSpy }, {} as never)
    );
    await render(component, { imports: [ngModule] });
  }

  it('renders the correct amount of group of terms', async () => {
    await setup(defaultStory);
    expect(screen.getAllByRole('term').length).toBe(5);
    expect(screen.getAllByRole('definition').length).toBe(5);
  });
});
