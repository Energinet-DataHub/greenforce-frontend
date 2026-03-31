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
  ProcessManagerBusinessReason,
  WorkflowAction,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhActionsRegistry } from '../src/actions/registry';
import { SupportedActionsPipe } from '../src/actions/supported-actions.pipe';

@Component({
  imports: [SupportedActionsPipe],
  template: `
    @for (action of actions | supportedActions: businessReason; track action) {
      <span>{{ action }}</span>
    } @empty {
      <span>No actions</span>
    }
  `,
})
class TestHost {
  actions: WorkflowAction[] | null = null;
  businessReason?: ProcessManagerBusinessReason;
}

async function setup(overrides: Partial<TestHost> = {}) {
  await render(TestHost, {
    providers: [
      {
        provide: DhActionsRegistry,
        useValue: {
          getSupportedActions: (
            actions: WorkflowAction[],
            reason: ProcessManagerBusinessReason
          ) => {
            const registered: Partial<Record<ProcessManagerBusinessReason, WorkflowAction[]>> = {
              [ProcessManagerBusinessReason.EndOfSupply]: [WorkflowAction.CancelWorkflow],
              [ProcessManagerBusinessReason.CustomerMoveIn]: [WorkflowAction.SendInformation],
            };
            const supported = registered[reason] ?? [];
            return actions.filter((a) => supported.includes(a));
          },
        },
      },
    ],
    imports: [getTranslocoTestingModule()],
    componentProperties: overrides,
  });
}

describe('SupportedActionsPipe', () => {
  it('should show CancelWorkflow for EndOfSupply', async () => {
    await setup({
      actions: [WorkflowAction.CancelWorkflow],
      businessReason: ProcessManagerBusinessReason.EndOfSupply,
    });

    expect(screen.getByText(WorkflowAction.CancelWorkflow)).toBeInTheDocument();
  });

  it('should filter out SendInformation for EndOfSupply', async () => {
    await setup({
      actions: [WorkflowAction.CancelWorkflow, WorkflowAction.SendInformation],
      businessReason: ProcessManagerBusinessReason.EndOfSupply,
    });

    expect(screen.getByText(WorkflowAction.CancelWorkflow)).toBeInTheDocument();
    expect(screen.queryByText(WorkflowAction.SendInformation)).not.toBeInTheDocument();
  });

  it('should show SendInformation for CustomerMoveIn', async () => {
    await setup({
      actions: [WorkflowAction.SendInformation],
      businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
    });

    expect(screen.getByText(WorkflowAction.SendInformation)).toBeInTheDocument();
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
      actions: [WorkflowAction.CancelWorkflow],
      businessReason: undefined,
    });

    expect(screen.getByText('No actions')).toBeInTheDocument();
  });

  it('should show no actions for unregistered business reason', async () => {
    await setup({
      actions: [WorkflowAction.CancelWorkflow],
      businessReason: ProcessManagerBusinessReason.NewMeteringPoint,
    });

    expect(screen.getByText('No actions')).toBeInTheDocument();
  });
});
