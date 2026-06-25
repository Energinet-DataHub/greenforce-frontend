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
import { ComponentFixtureAutoDetect } from '@angular/core/testing';

import { render, screen, within } from '@testing-library/angular';

import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util';
import { WattModalService } from '@energinet/watt/modal';

import { DhCancelProcessModal } from '../src/components/cancel-process-modal';

@Component({
  selector: 'dh-test-host',
  template: '',
})
class TestHostComponent {
  private readonly modalService = inject(WattModalService);

  open(data: { processType: string; confirmLabel?: string }) {
    this.modalService.open({ component: DhCancelProcessModal, data });
  }
}

async function setup(data: { processType: string; confirmLabel?: string }) {
  const { fixture } = await render(TestHostComponent, {
    providers: [WattModalService, { provide: ComponentFixtureAutoDetect, useValue: true }],
    imports: [getTranslocoTestingModule()],
  });

  fixture.componentInstance.open(data);

  const dialog = await screen.findByRole('dialog');
  return { dialog };
}

describe('Cancel process modal', () => {
  it('renders the provided confirm label when one is supplied', async () => {
    const { dialog } = await setup({ processType: 'service request', confirmLabel: 'Cancel' });

    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    // The generic fallback label must not be used when an override is given.
    expect(within(dialog).queryByRole('button', { name: "I'm sure" })).not.toBeInTheDocument();
  });

  it('falls back to the generic confirm label when none is supplied', async () => {
    const { dialog } = await setup({ processType: 'service request' });

    expect(within(dialog).getByRole('button', { name: "I'm sure" })).toBeInTheDocument();
  });
});
