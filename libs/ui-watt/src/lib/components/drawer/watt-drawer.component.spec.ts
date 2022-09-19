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

const { Normal: Drawer, Multiple, Loading } = composeStories(drawerStories);

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
  const getDrawerTopBarContent: () => HTMLSpanElement | null = () =>
    screen.queryByText(/top bar/i);
  const getDrawerActions: () => HTMLButtonElement | null = () =>
    screen.queryByText(/Primary action/i);
  const getDrawerContent: () => HTMLParagraphElement | null = () =>
    screen.queryByText(/drawer has been opened for/i);
  const getInitialTimer: () => HTMLParagraphElement | null = () =>
    screen.queryByText(/0s/i);
  const getStartedTimer: () => HTMLParagraphElement | null = () =>
    screen.queryByText(/1s/i);

  // Fakes
  let closedOutput = jest.fn();

  // Setup
  async function setup(
    story: Story<Partial<WattDrawerComponent>>,
    args?: Partial<WattDrawerComponent>
  ) {
    const { component, ngModule } = createMountableStoryComponent(
      story(
        { closed: closedOutput as unknown as EventEmitter<void>, ...args },
        {} as never
      )
    );
    await render(component, { imports: [ngModule] });
  }

  afterEach(() => {
    closedOutput = jest.fn();
  });

  it('should open drawer', async () => {
    await setup(Drawer);

    expect(getDrawerContent()).not.toBeInTheDocument();

    userEvent.click(getOpenDrawerButton());

    expect(getDrawerTopBarContent()).toBeInTheDocument();
    expect(getDrawerActions()).toBeInTheDocument();
    expect(getDrawerContent()).toBeInTheDocument();
  });

  it('should not add content more than once, when "open" is called multiple times', async () => {
    await setup(Drawer);

    userEvent.click(getOpenDrawerButton());
    userEvent.click(getOpenDrawerButton());

    expect(getDrawerTopBarContent()).toBeInTheDocument();
    expect(getDrawerActions()).toBeInTheDocument();
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

  it('closes on global Escape', async () => {
    await setup(Drawer);

    userEvent.click(getOpenDrawerButton());
    userEvent.type(getDrawerContent() as Element, '{esc}');

    expect(closedOutput).toHaveBeenCalled();
  });

  it('closes on Escape when focus is in the drawer', async () => {
    await setup(Drawer);

    userEvent.click(getOpenDrawerButton());

    getDrawerTopBarContent()?.focus();
    userEvent.type(getDrawerContent() as Element, '{esc}');

    expect(closedOutput).toHaveBeenCalled();
  });

  it('calls "closed" only once when Escape is pressed multiple times', async () => {
    await setup(Drawer);

    userEvent.click(getOpenDrawerButton());
    userEvent.type(getDrawerContent() as Element, '{esc}{esc}');

    expect(closedOutput).toHaveBeenCalledTimes(1);
  });

  it('does not call "closed" on Escape when drawer is closed', async () => {
    await setup(Drawer);

    userEvent.keyboard('{Escape}');

    expect(closedOutput).not.toHaveBeenCalled();
  });

  it('closes drawer when another drawer is opened', async () => {
    await setup(Multiple);
    const firstButton = screen.getByRole('button', { name: /^open first/i });
    const secondButton = screen.getByRole('button', { name: /^open second/i });

    userEvent.click(firstButton);
    userEvent.click(secondButton);

    expect(closedOutput).toHaveBeenCalled();
    expect(screen.queryByText(/first drawer/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/second drawer/i)).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    await setup(Drawer, { loading: true });

    userEvent.click(getOpenDrawerButton());

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('closes drawer when clicking outside', async () => {
    await setup(Loading);

    userEvent.click(screen.getByRole('button', { name: /^open first/i }));

    // This is an implementation detail, but it is the only way to test
    // this behavior - otherwise the second button click is happening in
    // the same event loop as the first button click (synchronous).
    await new Promise((res) => setTimeout(res, 0));

    userEvent.click(document.body);

    expect(closedOutput).toHaveBeenCalled();
    expect(getDrawerTopBarContent()).not.toBeInTheDocument();
  });

  it('does not call "closed" when click outside triggers an open', async () => {
    await setup(Loading);

    userEvent.click(screen.getByRole('button', { name: /^open first/i }));
    userEvent.click(screen.getByRole('button', { name: /^open second/i }));

    expect(closedOutput).not.toHaveBeenCalled();
    expect(getDrawerTopBarContent()).toBeInTheDocument();
  });
});
