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
import { render, screen, waitFor } from '@testing-library/angular';
import {
  composeStories,
  createMountableStoryComponent,
} from '@storybook/testing-angular';
import { EventEmitter } from '@angular/core';
import { Story } from '@storybook/angular';
import userEvent from '@testing-library/user-event';

import { WattDrawerComponent } from './watt-drawer.component';
import * as drawerStories from './+storybook/watt-drawer.stories';

const { Drawer } = composeStories(drawerStories);

describe(WattDrawerComponent.name, () => {
  // Queries
  const getOpenDrawerButton: () => HTMLButtonElement = () =>
    screen.getByRole('button', {
      name: /^open drawer/i,
    });
  const getExternalCloseDrawerButton: () => HTMLButtonElement = () =>
    screen.getByRole('button', {
      name: /^close drawer from outside of the drawer/i,
    });
  const getInternalCloseDrawerButton: () => HTMLButtonElement = () =>
    screen.getByRole('button', {
      name: 'close',
    });
  const getDrawerContent: () => HTMLParagraphElement | null = () =>
    screen.queryByText(/drawer has been opened for/i);
  const getInitialTimer: () => HTMLParagraphElement | null = () =>
    screen.queryByText(/0s/i);
  const getStartedTimer: () => HTMLParagraphElement | null = () =>
    screen.queryByText(/1s/i);

  // Fakes
  const closedOutput = jest.fn();

  // Setup
  async function setup(story: Story<Partial<WattDrawerComponent>>) {
    const { component, ngModule } = createMountableStoryComponent(
      story(
        { closed: closedOutput as unknown as EventEmitter<void> },
        {} as never
      )
    );
    await render(component, { imports: [ngModule] });
  }

  it('should open drawer', async () => {
    await setup(Drawer);

    expect(getDrawerContent()).not.toBeInTheDocument();

    userEvent.click(getOpenDrawerButton());

    expect(getDrawerContent()).toBeInTheDocument();
  });

  it('should not add content more than once, when "open" is called multiple times', async () => {
    await setup(Drawer);

    userEvent.click(getOpenDrawerButton());
    userEvent.click(getOpenDrawerButton());

    expect(getDrawerContent()).toBeInTheDocument();
  });

  it('should not load content, before the drawer is opened', async () => {
    await setup(Drawer);

    userEvent.click(getOpenDrawerButton());

    await waitFor(() => {
      expect(getInitialTimer()).toBeInTheDocument();
    });
  });

  it('should close drawer, triggered externally outside of the drawer', async () => {
    await setup(Drawer);

    userEvent.click(getOpenDrawerButton());
    userEvent.click(getExternalCloseDrawerButton());

    expect(getDrawerContent()).not.toBeInTheDocument();
  });

  it('should close drawer, triggered internally inside of the drawer', async () => {
    await setup(Drawer);

    userEvent.click(getOpenDrawerButton());
    userEvent.click(getInternalCloseDrawerButton());

    expect(getDrawerContent()).not.toBeInTheDocument();
  });

  it('should destroy content when closing', async () => {
    jest.useFakeTimers();
    await setup(Drawer);

    userEvent.click(getOpenDrawerButton());
    await waitFor(
      () => {
        expect(getStartedTimer()).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
    userEvent.click(getInternalCloseDrawerButton());
    userEvent.click(getOpenDrawerButton());

    await waitFor(() => {
      expect(getStartedTimer()).not.toBeInTheDocument();
      expect(getInitialTimer()).toBeInTheDocument();
    });
    jest.useRealTimers();
  });

  it('should output `closed` when drawer is closed', async () => {
    await setup(Drawer);

    userEvent.click(getOpenDrawerButton());
    userEvent.click(getInternalCloseDrawerButton());

    expect(closedOutput).toHaveBeenCalled();
  });

  it('should output `closed` when drawer is closed, from outside the drawer', async () => {
    await setup(Drawer);

    userEvent.click(getOpenDrawerButton());
    userEvent.click(getExternalCloseDrawerButton());

    expect(closedOutput).toHaveBeenCalled();
  });
});
