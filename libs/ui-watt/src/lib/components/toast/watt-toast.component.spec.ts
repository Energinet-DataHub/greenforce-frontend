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
import { queryByRole, render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import * as toastStories from './+storybook/watt-toast.stories';

const {
  Toast,
} = composeStories(toastStories);

describe('Toast', () => {
  async function setup(args: toastStories.WattToastStoryConfig = {}) {
    const { component, ngModule } = createMountableStoryComponent(
      Toast({disableAnimations: true, ...args}, {} as never)
    );
    await render(component, { imports: [ngModule] });

    const openToastButton = screen.getByRole('button', {name: /Open toast/});
    userEvent.click(openToastButton);

    const toast = screen.queryByText('You successfully launched a toast!');
    expect(toast).toBeInTheDocument();

    return {toast: toast?.parentElement?.parentElement};
  }

  it('should have an action button if an action is provided', async () => {
    const {toast} = await setup();

    await waitFor(() => {
      const actionButton = queryByRole(toast as HTMLElement, 'button', {name: /Action/i});
      expect(actionButton).toBeInTheDocument();
    });
  });

  it('should not have an action button if no action is provided', async () => {
    const {toast} = await setup({action: undefined});

    await waitFor(() => {
      const actionButton = queryByRole(toast as HTMLElement, 'button', {name: /Action/i});
      expect(actionButton).not.toBeInTheDocument();
    });
  });

  it('should dismiss the toast with provided action', async () => {

  });

  it('should not show icon for toasts of type=loading', async () => {

  });

  it('should show spinner for toasts of type=loading', async () => {

  });

  it('should not show spinner when toast is not of type=loading', () => {

  });

  it('should have a dismiss button', async () => {

  });
});
