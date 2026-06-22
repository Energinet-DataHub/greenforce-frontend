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
import { Router } from '@angular/router';
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
import { dayjs } from '@energinet/watt/date';
import { WattModalService } from '@energinet/watt/modal';

import { ServiceKindV1 } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhServiceRequestModal } from '../src/components/dh-service-request-modal';

const meteringPointId = 'mp-039';
const internalMeteringPointId = 'imp-039';
const processId = 'service-request-process-1';

@Component({
  selector: 'dh-test-host',
  template: '',
})
class TestHostComponent {
  private readonly modalService = inject(WattModalService);

  open() {
    this.modalService.open({
      component: DhServiceRequestModal,
      data: { meteringPointId, internalMeteringPointId, processId },
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

  const router = fixture.debugElement.injector.get(Router);
  vi.spyOn(router, 'navigate').mockResolvedValue(true);

  fixture.componentInstance.open();

  const dialog = await screen.findByRole('dialog');
  return { dialog, router, user: userEvent.setup() };
}

// The Watt datepicker's visible field is a Maskito-masked input with no accessible
// name of its own (the field label is bound to the hidden Material input), so there
// is no role/label query for it. We therefore reach it with one scoped querySelector
// on the dialog and type a valid in-range date so the submit-path assertions have a
// complete form. The date itself is not the behavior under test here.
async function setCutOffDate(dialog: HTMLElement, user: ReturnType<typeof userEvent.setup>) {
  const maskInput = dialog.querySelector('input.mask-input') as HTMLInputElement;
  await user.type(maskInput, dayjs().startOf('day').add(10, 'day').format('DDMMYYYY'));
}

describe('Service request modal', () => {
  it('offers only the three supported service types', async () => {
    const { dialog, user } = await setup();

    await user.click(within(dialog).getByRole('combobox'));

    const options = await screen.findAllByRole('option');
    expect(options).toHaveLength(3);
    expect(screen.getByRole('option', { name: /disconnection/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /reconnection/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /meter investigation/i })).toBeInTheDocument();
  });

  it('does not submit until both a type and a cut-off date are provided', async () => {
    let submissions = 0;
    server.use(
      graphql.mutation('RequestServiceServiceRequest', () => {
        submissions += 1;
        return HttpResponse.json({
          data: {
            __typename: 'Mutation',
            requestServiceServiceRequest: {
              __typename: 'RequestServiceServiceRequestPayload',
              boolean: true,
            },
          },
        });
      })
    );

    const { dialog, user } = await setup();
    const submit = within(dialog).getByRole('button', { name: /submit/i });

    // Empty form: nothing is sent.
    await user.click(submit);
    expect(submissions).toBe(0);

    // Only a type chosen, still no cut-off date: nothing is sent.
    await user.click(within(dialog).getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: /disconnection/i }));
    await user.click(submit);
    expect(submissions).toBe(0);

    // Positive control: with a cut-off date as well, the request goes through.
    await setCutOffDate(dialog, user);
    await user.click(submit);

    await waitForAsync(() => expect(submissions).toBe(1));
  });

  it('sends the chosen type, cut-off date and remark, then closes on success', async () => {
    let captured: Record<string, unknown> | undefined;
    server.use(
      graphql.mutation('RequestServiceServiceRequest', ({ variables }) => {
        captured = variables;
        return HttpResponse.json({
          data: {
            __typename: 'Mutation',
            requestServiceServiceRequest: {
              __typename: 'RequestServiceServiceRequestPayload',
              boolean: true,
            },
          },
        });
      })
    );

    const { dialog, user } = await setup();

    await user.click(within(dialog).getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: /disconnection/i }));
    await setCutOffDate(dialog, user);
    await user.type(within(dialog).getByRole('textbox', { name: /remarks/i }), 'Customer not home');

    await user.click(within(dialog).getByRole('button', { name: /submit/i }));

    // The modal closes itself with `true` on success, removing the dialog.
    await waitForAsync(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    expect(captured?.['meteringPointId']).toBe(meteringPointId);
    expect(captured?.['processId']).toBe(processId);
    expect(captured?.['serviceKind']).toBe(ServiceKindV1.Disconnect);
    expect(captured?.['description']).toBe('Customer not home');
    expect(captured?.['startDate']).toBeTruthy();
  });

  it('navigates to the process overview from the success toast action', async () => {
    server.use(
      graphql.mutation('RequestServiceServiceRequest', () =>
        HttpResponse.json({
          data: {
            __typename: 'Mutation',
            requestServiceServiceRequest: {
              __typename: 'RequestServiceServiceRequestPayload',
              boolean: true,
            },
          },
        })
      )
    );

    const { dialog, router, user } = await setup();

    await user.click(within(dialog).getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: /disconnection/i }));
    await setCutOffDate(dialog, user);
    await user.click(within(dialog).getByRole('button', { name: /submit/i }));

    // On success the modal closes and a toast offers an action that takes the
    // supplier to the metering point's process overview.
    const goToOverview = await screen.findByRole('button', {
      name: /see status under processes/i,
    });
    await user.click(goToOverview);

    expect(router.navigate).toHaveBeenCalledWith([
      'metering-point',
      internalMeteringPointId,
      'process-overview',
    ]);
  });

  it('shows a danger toast when the request fails', async () => {
    server.use(
      graphql.mutation('RequestServiceServiceRequest', () =>
        HttpResponse.json({ errors: [{ message: 'boom' }] })
      )
    );

    const { dialog, user } = await setup();

    await user.click(within(dialog).getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: /disconnection/i }));
    await setCutOffDate(dialog, user);
    await user.click(within(dialog).getByRole('button', { name: /submit/i }));

    // The failing mutation surfaces a danger toast (the modal's only error feedback).
    expect(await screen.findByRole('paragraph')).toHaveTextContent(/service request failed/i);
  });
});
