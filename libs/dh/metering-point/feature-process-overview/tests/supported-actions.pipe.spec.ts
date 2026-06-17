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
import { Component } from '@angular/core';

import { render, screen } from '@testing-library/angular';

import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util';
import {
  MeteringPointProcessAction,
  ProcessManagerBusinessReason,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhActionsRegistry } from '../src/actions/registry';
import { SupportedActionsPipe } from '../src/actions/supported-actions.pipe';

@Component({
  imports: [SupportedActionsPipe],
  template: `
    @for (
      action of actions | supportedActions: businessReason : isEnergySupplierResponsible;
      track action
    ) {
      <span>{{ action }}</span>
    } @empty {
      <span>No actions</span>
    }
  `,
})
class TestHost {
  actions: MeteringPointProcessAction[] | null = null;
  businessReason?: ProcessManagerBusinessReason;
  isEnergySupplierResponsible?: boolean;
}

async function setup(overrides: Partial<TestHost> = {}) {
  const getSupportedActions = vi.fn(
    (actions: MeteringPointProcessAction[], reason: ProcessManagerBusinessReason) => {
      const registered: Partial<
        Record<ProcessManagerBusinessReason, MeteringPointProcessAction[]>
      > = {
        [ProcessManagerBusinessReason.EndOfSupply]: [MeteringPointProcessAction.CancelWorkflow],
        [ProcessManagerBusinessReason.CustomerMoveIn]: [
          MeteringPointProcessAction.SendInformation,
          MeteringPointProcessAction.InitiateIncorrectMoveIn,
        ],
      };
      const supported = registered[reason] ?? [];
      return actions.filter((a) => supported.includes(a));
    }
  );

  await render(TestHost, {
    providers: [
      {
        provide: DhActionsRegistry,
        useValue: { getSupportedActions },
      },
    ],
    imports: [getTranslocoTestingModule()],
    componentProperties: overrides,
  });

  return { getSupportedActions };
}

describe('SupportedActionsPipe', () => {
  it('should show CancelWorkflow for EndOfSupply', async () => {
    await setup({
      actions: [MeteringPointProcessAction.CancelWorkflow],
      businessReason: ProcessManagerBusinessReason.EndOfSupply,
    });

    expect(screen.getByText(MeteringPointProcessAction.CancelWorkflow)).toBeInTheDocument();
  });

  it('should filter out SendInformation for EndOfSupply', async () => {
    await setup({
      actions: [
        MeteringPointProcessAction.CancelWorkflow,
        MeteringPointProcessAction.SendInformation,
      ],
      businessReason: ProcessManagerBusinessReason.EndOfSupply,
    });

    expect(screen.getByText(MeteringPointProcessAction.CancelWorkflow)).toBeInTheDocument();
    expect(screen.queryByText(MeteringPointProcessAction.SendInformation)).not.toBeInTheDocument();
  });

  it('should show SendInformation for CustomerMoveIn', async () => {
    await setup({
      actions: [MeteringPointProcessAction.SendInformation],
      businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
    });

    expect(screen.getByText(MeteringPointProcessAction.SendInformation)).toBeInTheDocument();
  });

  it('should show InitiateIncorrectMoveIn for CustomerMoveIn', async () => {
    await setup({
      actions: [MeteringPointProcessAction.InitiateIncorrectMoveIn],
      businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
    });

    expect(
      screen.getByText(MeteringPointProcessAction.InitiateIncorrectMoveIn)
    ).toBeInTheDocument();
  });

  it('should show no actions when actions is null', async () => {
    await setup({
      actions: null,
      businessReason: ProcessManagerBusinessReason.EndOfSupply,
    });

    expect(screen.getByText('No actions')).toBeInTheDocument();
  });

  it('should show no actions when businessReason is undefined', async () => {
    await setup({
      actions: [MeteringPointProcessAction.CancelWorkflow],
      businessReason: undefined,
    });

    expect(screen.getByText('No actions')).toBeInTheDocument();
  });

  it('should show no actions for unregistered business reason', async () => {
    await setup({
      actions: [MeteringPointProcessAction.CancelWorkflow],
      businessReason: ProcessManagerBusinessReason.NewMeteringPoint,
    });

    expect(screen.getByText('No actions')).toBeInTheDocument();
  });

  it('should forward isEnergySupplierResponsible to the registry', async () => {
    const { getSupportedActions } = await setup({
      actions: [MeteringPointProcessAction.CancelWorkflow],
      businessReason: ProcessManagerBusinessReason.EndOfSupply,
      isEnergySupplierResponsible: true,
    });

    expect(getSupportedActions).toHaveBeenCalledWith(
      [MeteringPointProcessAction.CancelWorkflow],
      ProcessManagerBusinessReason.EndOfSupply,
      true,
      undefined,
      undefined,
      undefined
    );
  });

  it('should default isEnergySupplierResponsible to false when not bound', async () => {
    const { getSupportedActions } = await setup({
      actions: [MeteringPointProcessAction.CancelWorkflow],
      businessReason: ProcessManagerBusinessReason.EndOfSupply,
    });

    expect(getSupportedActions).toHaveBeenCalledWith(
      [MeteringPointProcessAction.CancelWorkflow],
      ProcessManagerBusinessReason.EndOfSupply,
      false,
      undefined,
      undefined,
      undefined
    );
  });
});
