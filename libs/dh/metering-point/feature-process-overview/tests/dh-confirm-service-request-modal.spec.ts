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
import { Component, inject } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';

import { render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { graphql, HttpResponse } from 'msw';

const server = globalThis.__mswServer;

import {
  getTranslocoTestingModule,
  provideMsalTesting,
  waitForAsync,
} from '@energinet-datahub/dh/shared/test-util';
import { danishDatetimeProviders } from '@energinet/watt/danish-date-time';
import { WattModalService } from '@energinet/watt/modal';

import { DhConfirmServiceRequestModal } from '../src/components/dh-confirm-service-request-modal';

const meteringPointId = 'mp-039';
const processId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
const startDate = new Date('2026-02-16T00:00:00Z');

@Component({
  selector: 'dh-test-host',
  template: '',
})
class TestHostComponent {
  private readonly modalService = inject(WattModalService);

  open() {
    this.modalService.open({
      component: DhConfirmServiceRequestModal,
      data: { meteringPointId, processId, startDate },
    });
  }
}

async function setup() {
  const { fixture } = await render(TestHostComponent, {
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      danishDatetimeProviders,
      provideMsalTesting(),
      WattModalService,
      { provide: ComponentFixtureAutoDetect, useValue: true },
    ],
    imports: [getTranslocoTestingModule()],
  });

  fixture.componentInstance.open();

  const dialog = await screen.findByRole('dialog');
  return { dialog, user: userEvent.setup() };
}

describe('Confirm service request modal', () => {
  it('shows the title, read-only cut-off date and remark field without a type row', async () => {
    const { dialog } = await setup();

    expect(
      within(dialog).getByRole('heading', { name: /approve service request/i })
    ).toBeInTheDocument();

    // The cut-off date is rendered read-only through the date pipe (no editable type row).
    expect(within(dialog).queryByRole('combobox')).not.toBeInTheDocument();
    expect(dialog).toHaveTextContent('16-02-2026');

    // The optional remark is the only editable field.
    expect(within(dialog).getByRole('textbox', { name: /remark/i })).toBeInTheDocument();
  });

  it('sends the entered remark and closes on success', async () => {
    let captured: Record<string, unknown> | undefined;
    server.use(
      graphql.mutation('ConfirmServiceRequest', ({ variables }) => {
        captured = variables;
        return HttpResponse.json({
          data: {
            __typename: 'Mutation',
            confirmServiceRequest: {
              __typename: 'ConfirmServiceRequestPayload',
              boolean: true,
            },
          },
        });
      })
    );

    const { dialog, user } = await setup();

    await user.type(
      within(dialog).getByRole('textbox', { name: /remark/i }),
      'Approved by operator'
    );
    await user.click(within(dialog).getByRole('button', { name: /approve/i }));

    // The modal closes itself with `true` on success, removing the dialog.
    await waitForAsync(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    expect(captured?.['meteringPointId']).toBe(meteringPointId);
    expect(captured?.['processId']).toBe(processId);
    expect(captured?.['description']).toBe('Approved by operator');
  });

  it('shows a danger toast when approving fails', async () => {
    server.use(
      graphql.mutation('ConfirmServiceRequest', () =>
        HttpResponse.json({ errors: [{ message: 'boom' }] })
      )
    );

    const { dialog, user } = await setup();

    await user.click(within(dialog).getByRole('button', { name: /approve/i }));

    // The failing mutation surfaces a danger toast (the modal's only error feedback).
    expect(await screen.findByRole('paragraph')).toHaveTextContent(/approving the service failed/i);
  });
});
