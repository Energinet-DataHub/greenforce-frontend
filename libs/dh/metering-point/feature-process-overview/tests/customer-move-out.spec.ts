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
import { TestBed } from '@angular/core/testing';

import { WattModalService } from '@energinet/watt/modal';

import {
  ElectricityMarketViewConnectionState,
  MeteringPointProcessAction,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { CustomerMoveOutActions } from '../src/actions/customer-move-out/customer-move-out';
import { DhRequestIncorrectMoveInModal } from '../src/components/request-incorrect-move-in-modal';
import { ProcessActionContext } from '../src/actions/context';

const baseContext: ProcessActionContext = {
  meteringPointId: 'mp-1',
  internalMeteringPointId: 'imp-1',
  processId: 'process-1',
  connectionState: ElectricityMarketViewConnectionState.Connected,
  cutoffDate: new Date('2026-02-16T00:00:00Z'),
};

function setup() {
  const open = vi.fn();
  TestBed.configureTestingModule({
    providers: [{ provide: WattModalService, useValue: { open } }],
  });
  return { actions: TestBed.inject(CustomerMoveOutActions), open };
}

describe('CustomerMoveOutActions', () => {
  beforeEach(() => TestBed.resetTestingModule());

  const handler = () =>
    TestBed.inject(CustomerMoveOutActions).handlers[
      MeteringPointProcessAction.InitiateIncorrectMoveOut
    ];

  it('is gated by move-in permission and the initiating participant, with no release toggle', () => {
    setup();
    const moveOut = handler();

    expect(moveOut?.releaseToggle).toBeUndefined();
    expect(moveOut?.permissions).toEqual(['metering-point:move-in']);
    expect(moveOut?.roles).toEqual(['InitiatingParticipant']);
  });

  it('opens the shared request-incorrect-move-in modal with the process details', () => {
    const { open } = setup();

    handler()?.callback(baseContext);

    expect(open).toHaveBeenCalledWith({
      component: DhRequestIncorrectMoveInModal,
      data: {
        meteringPointId: 'mp-1',
        processId: 'process-1',
        cutoffDate: baseContext.cutoffDate,
      },
    });
  });

  it('does not open the modal when the cut-off date is missing', () => {
    const { open } = setup();

    handler()?.callback({ ...baseContext, cutoffDate: null });

    expect(open).not.toHaveBeenCalled();
  });
});
