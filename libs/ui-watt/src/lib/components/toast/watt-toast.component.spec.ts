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
import {
  queryByTestId,
  render,
  screen,
  waitFor,
} from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import * as toastStories from './+storybook/watt-toast.stories';

const { Overview } = composeStories(toastStories);

describe('Toast', () => {
  const getOpenToastButton = async () =>
    screen.getByRole('button', { name: /Open toast/ });
  const getToast = async () =>
    screen.queryByText('You successfully launched a toast!')?.parentElement
      ?.parentElement;

  async function setup(args: Partial<toastStories.WattToastStoryConfig> = {}) {
    const { component, ngModule } = createMountableStoryComponent(
      Overview({ disableAnimations: true, ...args }, {} as never)
    );
    const { fixture } = await render(component, { imports: [ngModule] });
    return { fixture };
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

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should not dismiss a toast of type=loading after 5s', async () => {
    jest.useFakeTimers();
    await setup({ type: 'loading' });
    userEvent.click(await getOpenToastButton());
    expect(await getToast()).toBeInTheDocument();

    jest.advanceTimersByTime(5000);

    expect(await getToast()).toBeInTheDocument();

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should reset the duration of the toast on hover', async () => {
    jest.useFakeTimers();
    await setup();
    userEvent.click(await getOpenToastButton());
    expect(await getToast()).toBeInTheDocument();

    jest.advanceTimersByTime(4000);
    userEvent.hover((await getToast()) as HTMLElement);
    jest.advanceTimersByTime(5000);
    expect(await getToast()).toBeInTheDocument();

    userEvent.unhover((await getToast()) as HTMLElement);
    jest.advanceTimersByTime(5000);
    expect(await getToast()).not.toBeInTheDocument();

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should dismiss the toast, when clicking the close button', async () => {
    await setup();

    userEvent.click(await getOpenToastButton());
    const toast = await getToast();
    expect(toast).toBeInTheDocument();

    const closeButton = queryByTestId(toast as HTMLElement, 'dismiss');
    userEvent.click(closeButton as HTMLElement);

    await waitFor(() => {
      expect(toast).not.toBeInTheDocument();
    });
  });

  it('should not have a dimiss button, when of type=loading', async () => {
    await setup({ type: 'loading' });

    userEvent.click(await getOpenToastButton());
    const toast = await getToast();
    expect(toast).toBeInTheDocument();

    const closeButton = queryByTestId(toast as HTMLElement, 'dismiss');
    expect(closeButton).not.toBeInTheDocument();
  });
});
