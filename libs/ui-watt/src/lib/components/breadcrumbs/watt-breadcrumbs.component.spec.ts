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
import {
  composeStory,
  createMountableStoryComponent,
} from '@storybook/testing-angular';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/angular';
import { Story } from '@storybook/angular';
import Meta, { Overview } from './watt-breadcrumbs.stories';

import { WattBreadcrumbsComponent } from './watt-breadcrumbs.component';
import userEvent from '@testing-library/user-event';

const overviewStory = composeStory(Overview, Meta);

describe(WattBreadcrumbsComponent.name, () => {
  async function setup(story: Story, clickSpy?: unknown) {
    const { component, ngModule } = createMountableStoryComponent(
      story({onClick: clickSpy}, {} as never)
    );
    await render(component, { imports: [ngModule] });
  }

  const getSeperators = () => screen.getAllByRole('img'); // role of watt-icon is img
  const getBreadcrumbWithRouterLink = () => screen.queryByText('Breadcrumbs');
  const getBreadcrumbWithClick = () => screen.queryByText('Components');
  const getNoninteractiveBreadcrumb = () => screen.queryByText('Overview');

  it('should render correct amount of seperators', async () => {
    await setup(overviewStory);
    expect(getSeperators()).toHaveLength(2);
  });

  it('should render correct amount of links', async () => {
    await setup(overviewStory);
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('should not render "Overview" as link', async () => {
    await setup(overviewStory);
    expect(getNoninteractiveBreadcrumb()).not.toHaveAttribute('role', 'link');
  });

  it('should mark breadcrumb with [routerLink] as interactive', async () => {
    await setup(overviewStory);
    expect(getBreadcrumbWithRouterLink()).toHaveClass('interactive');
  });

  it('should mark breadcrumb with (click) as interactive', async () => {
    await setup(overviewStory);
    expect(getBreadcrumbWithClick()).toHaveClass('interactive');
  });

  it('should navigate on click, when routerLink is added', async () => {
    await setup(overviewStory);
    const getDefaultRoute = () => screen.getByText('Route:Overview');
    const getExpectedRoute = () => screen.getByText('Route:Breadcrumbs');
    expect(getDefaultRoute()).toBeInTheDocument();

    userEvent.click(getBreadcrumbWithRouterLink() as HTMLElement);
    await waitForElementToBeRemoved(() => getDefaultRoute());

    expect(getExpectedRoute()).toBeInTheDocument();
  });

  it('should trigger click callback, when (click) is added', async () => {
    const mockFn = jest.fn();
    await setup(overviewStory, mockFn);

    userEvent.click(getBreadcrumbWithClick() as HTMLElement);

    expect(mockFn).toHaveBeenCalled();
  });
});
