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

import { DhRequestIncorrectChangeOfSupplierModal } from '../src/components/request-incorrect-change-of-supplier-modal';

@Component({
  selector: 'dh-test-host',
  template: '',
})
class TestHostComponent {
  private readonly modalService = inject(WattModalService);

  open() {
    this.modalService.open({
      component: DhRequestIncorrectChangeOfSupplierModal,
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

describe('Request incorrect change of supplier modal', () => {
  it('shows the title and the description with the formatted cut-off date', async () => {
    const { dialog } = await setup();

    expect(
      within(dialog).getByRole('heading', {
        name: /Request correction: Incorrect change of supplier/i,
      })
    ).toBeInTheDocument();

    expect(within(dialog).getByRole('paragraph')).toHaveTextContent(
      'Request correction of change of supplier with cut-off date 16-02-2026?'
    );
  });

  it('renders the conditions as a link to the external rules page in a new tab', async () => {
    const { dialog } = await setup();

    // The conditions prefix is a real anchor (role "link"), not plain label text.
    // Being interactive content inside the checkbox label is what makes a real
    // browser open the rules page instead of toggling the checkbox. This no-toggle
    // behavior is verified in-browser (happy-dom models label clicks differently),
    // so here we guard the structural cause: it stays a link with the right target.
    const conditionsLink = within(dialog).getByRole('link', { name: /conditions/i });
    expect(conditionsLink).toHaveAttribute('href', 'https://energinet.dk/regler/el/elmarked/');
    expect(conditionsLink).toHaveAttribute('target', '_blank');
    expect(conditionsLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not submit until the conditions are confirmed, and allows an empty reason', async () => {
    let submissions = 0;
    let submittedReason: string | null | undefined;
    server.use(
      graphql.mutation('RequestIncorrectChangeOfSupplier', ({ variables }) => {
        submissions += 1;
        submittedReason = variables['reason'];
        return HttpResponse.json({
          data: {
            __typename: 'Mutation',
            requestIncorrectChangeOfSupplier: {
              __typename: 'RequestIncorrectChangeOfSupplierPayload',
              success: true,
            },
          },
        });
      })
    );

    const { dialog } = await setup();
    const user = userEvent.setup();
    const submit = within(dialog).getByRole('button', { name: /Request correction/i });

    // Submitting before confirming the conditions does nothing.
    await user.click(submit);
    expect(submissions).toBe(0);

    // After confirming the conditions, submission goes through even without a reason.
    await user.click(within(dialog).getByRole('checkbox'));
    await user.click(submit);

    await waitForAsync(() => expect(submissions).toBe(1));
    expect(submittedReason).toBeFalsy();
  });

  it('sends the entered reason when submitting', async () => {
    let sentReason: string | undefined;
    server.use(
      graphql.mutation('RequestIncorrectChangeOfSupplier', ({ variables }) => {
        sentReason = variables['reason'];
        return HttpResponse.json({
          data: {
            __typename: 'Mutation',
            requestIncorrectChangeOfSupplier: {
              __typename: 'RequestIncorrectChangeOfSupplierPayload',
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
      'Wrong supplier'
    );
    await user.click(within(dialog).getByRole('checkbox'));
    await user.click(within(dialog).getByRole('button', { name: /Request correction/i }));

    await waitForAsync(() => expect(sentReason).toBe('Wrong supplier'));
  });
});
