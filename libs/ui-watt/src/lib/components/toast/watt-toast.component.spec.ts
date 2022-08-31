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
  composeStories,
  createMountableStoryComponent,
} from '@storybook/testing-angular';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import * as toastStories from './+storybook/watt-toast.stories';

const { Overview } = composeStories(toastStories);

describe('Toast', () => {
  const getOpenToastButton = async () => screen.getByRole('button', { name: /Open toast/ });
  const getToast = async () => screen.queryByText('You successfully launched a toast!');

  async function setup(args: Partial<toastStories.WattToastStoryConfig> = {}) {
    const { component, ngModule } = createMountableStoryComponent(
      Overview({ disableAnimations: true, ...args }, {} as never)
    );
    await render(component, { imports: [ngModule] });
  }

  it('should open toast', async () => {
    await setup();
    userEvent.click(await getOpenToastButton());
    expect(await getToast()).toBeInTheDocument();
  });

  it('should dismiss toast after 5s', async () => {
    jest.useFakeTimers();
    await setup();
    userEvent.click(await getOpenToastButton());
    expect(await getToast()).toBeInTheDocument();

    jest.advanceTimersByTime(5000);

    expect(await getToast()).not.toBeInTheDocument();

    jest.runOnlyPendingTimers()
    jest.useRealTimers();
  });

  it('should not dismiss a toast of type=loading after 5s', async () => {
    jest.useFakeTimers();
    await setup({type: 'loading'});
    userEvent.click(await getOpenToastButton());
    expect(await getToast()).toBeInTheDocument();

    jest.advanceTimersByTime(5000);

    expect(await getToast()).toBeInTheDocument();

    jest.runOnlyPendingTimers()
    jest.useRealTimers();
  });

  it('should reset the duration of the toast on hover', async () => {
    jest.useFakeTimers();
    await setup();
    userEvent.click(await getOpenToastButton());
    expect(await getToast()).toBeInTheDocument();

    jest.advanceTimersByTime(4000);
    userEvent.hover(await getToast() as HTMLElement);
    jest.advanceTimersByTime(5000);
    expect(await getToast()).toBeInTheDocument();

    userEvent.unhover(await getToast() as HTMLElement);
    jest.advanceTimersByTime(5000);
    expect(await getToast()).not.toBeInTheDocument();

    jest.runOnlyPendingTimers()
    jest.useRealTimers();
  });

  /*
  it('should have an action button if an action is provided', async () => {
    const { toast } = await setup();

    await waitFor(() => {
      const actionButton = queryByRole(toast as HTMLElement, 'button', {
        name: /Action/i,
      });
      expect(actionButton).toBeInTheDocument();
    });
  });

  it('should not have an action button if no action is provided', async () => {
    const { toast } = await setup({ action: undefined });

    await waitFor(() => {
      const actionButton = queryByRole(toast as HTMLElement, 'button', {
        name: /Action/i,
      });
      expect(actionButton).not.toBeInTheDocument();
    });
  });

  it('should dismiss the toast with provided action', async () => {});

  it('should not show icon for toasts of type=loading', async () => {});

  it('should not show close button for toasts of type=loading', async () => {});

  it('should show spinner for toasts of type=loading', async () => {});

  it('should not show spinner when toast is not of type=loading', () => {});

  it('should have a dismiss button', async () => {});

  it('should not have default duration, when the type is loading', () => {});

  it('should not dismiss the toast, when user is hovering it', () => {});
  */
});
