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

import { ServiceKindV1 } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhConfirmServiceRequestModal } from '../src/components/dh-confirm-service-request-modal';

const meteringPointId = 'mp-039';
const processId = 'service-request-process-1';
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
      data: { meteringPointId, processId, serviceKind: ServiceKindV1.Disconnect, startDate },
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
  it('shows the requested service kind and cut-off date read-only', async () => {
    const { dialog } = await setup();

    // The requested type is shown as a translated, non-editable value (no combobox/dropdown).
    expect(within(dialog).queryByRole('combobox')).not.toBeInTheDocument();
    expect(dialog).toHaveTextContent(/disconnection/i);

    // The cut-off date is rendered through the date pipe.
    expect(dialog).toHaveTextContent('16-02-2026');
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

    await user.type(within(dialog).getByRole('textbox', { name: /remark/i }), 'Approved by operator');
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
