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
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { WattButtonComponent } from '../button';
import { WATT_MODAL } from './';
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
    imports: [WattButtonComponent, WATT_MODAL],
    componentProperties,
  });
}

describe(WattModalComponent, () => {
  it('starts closed', async () => {
    await setup();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on button click', async () => {
    await setup();
    userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
  });

  it('closes when rejected', async () => {
    const closed = jest.fn();
    await setup({ closed });
    userEvent.click(screen.getByRole('button'));
    userEvent.click(screen.getByText('No'));
    await waitFor(() => expect(closed).toBeCalledWith(false));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes when accepted', async () => {
    const closed = jest.fn();
    await setup({ closed });
    userEvent.click(screen.getByRole('button'));
    userEvent.click(screen.getByText('Yes'));
    await waitFor(() => expect(closed).toBeCalledWith(true));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on ESC', async () => {
    const closed = jest.fn();
    await setup({ closed });
    userEvent.click(screen.getByRole('button'));
    userEvent.keyboard('[Escape]');
    await waitFor(() => expect(closed).toBeCalledWith(false));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on close button click', async () => {
    const closed = jest.fn();
    await setup({ closed });
    userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    userEvent.click(screen.getByLabelText('Close'));
    await waitFor(() => expect(closed).toBeCalledWith(false));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('disables close button', async () => {
    const closed = jest.fn();
    await setup({ closed, disableClose: true });
    userEvent.click(screen.getByRole('button'));
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
  });

  it('disables ESC', async () => {
    const closed = jest.fn();
    await setup({ closed, disableClose: true });
    userEvent.click(screen.getByRole('button'));
    userEvent.keyboard('[Escape]');
    await waitFor(() => expect(closed).not.toBeCalled());
    expect(screen.queryByRole('dialog')).toBeInTheDocument();
  });

  it('displays title', async () => {
    await setup();
    userEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(screen.getByRole('heading')).toHaveTextContent('Test Modal');
  });
});
