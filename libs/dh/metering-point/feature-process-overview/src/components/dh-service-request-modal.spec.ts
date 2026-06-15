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
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { graphql, HttpResponse } from 'msw';
import { vi } from 'vitest';

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

import { DhServiceRequestModal } from './dh-service-request-modal';

const meteringPointId = 'mp-039';
const processId = 'service-request-process-1';

async function setup() {
  const dialogRef = { close: vi.fn() };

  const { fixture } = await render(DhServiceRequestModal, {
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      danishDatetimeProviders,
      provideMsalTesting(),
      WattModalService,
      { provide: ComponentFixtureAutoDetect, useValue: true },
      { provide: MAT_DIALOG_DATA, useValue: { meteringPointId, processId } },
      { provide: MatDialogRef, useValue: dialogRef },
    ],
    imports: [getTranslocoTestingModule()],
  });

  return { fixture, dialogRef, user: userEvent.setup() };
}

describe('Service request modal', () => {
  it('offers only the three supported service types', async () => {
    const { user } = await setup();

    await user.click(screen.getByRole('combobox'));

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

    const { fixture, user } = await setup();
    const submit = screen.getByRole('button', { name: /submit/i });

    // Empty form: nothing is sent.
    await user.click(submit);
    expect(submissions).toBe(0);

    // Only a type chosen, still no cut-off date: nothing is sent.
    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: /disconnection/i }));
    await user.click(submit);
    expect(submissions).toBe(0);

    // With a cut-off date as well, the request goes through.
    fixture.componentInstance.form.controls.startDate.setValue(
      dayjs().startOf('day').add(10, 'day').toDate()
    );
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

    const { fixture, dialogRef, user } = await setup();

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: /disconnection/i }));

    fixture.componentInstance.form.controls.startDate.setValue(
      dayjs().startOf('day').add(10, 'day').toDate()
    );

    await user.type(screen.getByRole('textbox', { name: /remarks/i }), 'Customer not home');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitForAsync(() => expect(dialogRef.close).toHaveBeenCalledWith(true));

    expect(captured?.['meteringPointId']).toBe(meteringPointId);
    expect(captured?.['processId']).toBe(processId);
    expect(captured?.['serviceKind']).toBe(ServiceKindV1.Disconnect);
    expect(captured?.['description']).toBe('Customer not home');
    expect(captured?.['startDate']).toBeTruthy();
  });

  it('limits the cut-off date to 60 days into the future', async () => {
    const { fixture } = await setup();

    const expectedMax = dayjs().startOf('day').add(60, 'day').toDate();
    expect(fixture.componentInstance.maxDate.getTime()).toBe(expectedMax.getTime());
  });
});
