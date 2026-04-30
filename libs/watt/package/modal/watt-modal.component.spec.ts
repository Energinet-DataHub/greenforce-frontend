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
import { render, screen } from '@testing-library/angular';
import { waitForAsync } from '@energinet-datahub/gf/test-util-staging';
import userEvent from '@testing-library/user-event';

import { WattButtonComponent } from '../button';
import { WATT_MODAL, WattModalService } from './';
import { WattModalComponent } from './watt-modal.component';

const template = `
  <watt-button (click)="modal.open()">Open Modal</watt-button>
  <watt-modal
    #modal
    title="Test Modal"
    (closed)="closed($event)"
    [disableClose]="disableClose"
  >
    <p>Is this a test modal?</p>
    <watt-modal-actions>
      <watt-button (click)="modal.close(false)">No</watt-button>
      <watt-button (click)="modal.close(true)">Yes</watt-button>
    </watt-modal-actions>
  </watt-modal>
`;

interface Properties {
  closed?: (result: boolean) => void;
  disableClose?: boolean;
}

function setup(componentProperties?: Properties) {
  return render(template, {
    imports: [WattButtonComponent, ...WATT_MODAL],
    providers: [WattModalService],
    componentProperties,
  });
}

// MatDialog filters Escape by the deprecated `keyCode === 27`, which neither
// the KeyboardEvent constructor nor user-event v14 populates. Dispatch a
// synthetic event with `keyCode` defined explicitly so the filter triggers.
function dispatchEscape(target: Element) {
  const event = new KeyboardEvent('keydown', {
    key: 'Escape',
    code: 'Escape',
    bubbles: true,
  });
  Object.defineProperty(event, 'keyCode', { get: () => 27 });
  target.dispatchEvent(event);
}

describe(WattModalComponent, () => {
  it('starts closed', async () => {
    await setup();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on button click', async () => {
    await setup({
      closed: () => {
        /* noop */
      },
    });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));
    await waitForAsync(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    // Close before teardown to avoid NG0953 (closed OutputRef emit after destroy)
    await user.click(screen.getByLabelText('Close'));
    await waitForAsync(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes when rejected', async () => {
    const closed = vi.fn();
    await setup({ closed });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('No'));
    await waitForAsync(() => expect(closed).toBeCalledWith(false));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes when accepted', async () => {
    const closed = vi.fn();
    await setup({ closed });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Yes'));
    await waitForAsync(() => expect(closed).toBeCalledWith(true));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on ESC', async () => {
    const closed = vi.fn();
    await setup({ closed });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));
    dispatchEscape(await screen.findByRole('dialog'));
    await waitForAsync(() => expect(closed).toBeCalledWith(false));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on close button click', async () => {
    const closed = vi.fn();
    await setup({ closed });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));
    await waitForAsync(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText('Close'));
    await waitForAsync(() => expect(closed).toBeCalledWith(false));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('disables close button', async () => {
    const closed = vi.fn();
    await setup({ closed, disableClose: true });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
    // Close via service to avoid NG0953 (closed OutputRef emit after destroy)
    await user.click(screen.getByText('No'));
    await waitForAsync(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('disables ESC', async () => {
    const closed = vi.fn();
    await setup({ closed, disableClose: true });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));
    dispatchEscape(await screen.findByRole('dialog'));
    await waitForAsync(() => expect(closed).not.toBeCalled());
    expect(screen.queryByRole('dialog')).toBeInTheDocument();
    // Close before teardown to avoid NG0953 (closed OutputRef emit after destroy)
    await user.click(screen.getByText('No'));
    await waitForAsync(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('displays title', async () => {
    await setup({
      closed: () => {
        /* noop */
      },
    });
    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));
    await waitForAsync(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    expect(screen.getByRole('heading')).toHaveTextContent('Test Modal');
    // Close before teardown to avoid NG0953 (closed OutputRef emit after destroy)
    await user.click(screen.getByLabelText('Close'));
    await waitForAsync(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
