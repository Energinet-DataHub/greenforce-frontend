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

import { DhRequestIncorrectMoveInModal } from '../src/components/request-incorrect-move-in-modal';

@Component({
  selector: 'dh-test-host',
  template: '',
})
class TestHostComponent {
  private readonly modalService = inject(WattModalService);

  open() {
    this.modalService.open({
      component: DhRequestIncorrectMoveInModal,
      data: {
        meteringPointId: 'mp-123',
        processId: 'process-1',
        cutoffDate: new Date('2026-02-16T00:00:00Z'),
      },
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
  return { dialog };
}

describe('Request incorrect move-in modal', () => {
  it('shows the title and the description with the formatted cut-off date', async () => {
    const { dialog } = await setup();

    expect(
      within(dialog).getByRole('heading', { name: /Request correction: Incorrect move/i })
    ).toBeInTheDocument();

    expect(within(dialog).getByRole('paragraph')).toHaveTextContent(
      'Request correction of move with cut-off date 16-02-2026?'
    );
  });

  it('enables the request correction action once the conditions are confirmed, without requiring a reason', async () => {
    const { dialog } = await setup();
    const user = userEvent.setup();

    const submit = within(dialog).getByRole('button', { name: /Request correction/i });
    expect(submit).toBeDisabled();

    // Confirming the conditions alone enables the action; the reason is optional.
    await user.click(within(dialog).getByRole('checkbox'));
    await waitForAsync(() => expect(submit).toBeEnabled());
  });

  it('sends the entered reason when submitting', async () => {
    let sentReason: string | undefined;
    server.use(
      graphql.mutation('RequestIncorrectMoveIn', ({ variables }) => {
        sentReason = variables['reason'];
        return HttpResponse.json({
          data: {
            __typename: 'Mutation',
            requestIncorrectMoveIn: {
              __typename: 'RequestIncorrectMoveInPayload',
              success: true,
            },
          },
        });
      })
    );

    const { dialog } = await setup();
    const user = userEvent.setup();

    await user.type(
      within(dialog).getByRole('textbox', { name: /reason for request/i }),
      'Wrong tenant'
    );
    await user.click(within(dialog).getByRole('checkbox'));

    const submit = within(dialog).getByRole('button', { name: /Request correction/i });
    await waitForAsync(() => expect(submit).toBeEnabled());
    await user.click(submit);

    await waitForAsync(() => expect(sentReason).toBe('Wrong tenant'));
  });
});
