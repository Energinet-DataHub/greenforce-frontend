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
import { render } from '@testing-library/angular';

import { MeteringPointProcessState } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhProcessStateBadge } from '../src/components/process-state-badge';

async function renderBadge(status: MeteringPointProcessState) {
  const { container } = await render(DhProcessStateBadge, {
    componentInputs: { status },
  });
  return container.querySelector('watt-badge');
}

describe('DhProcessStateBadge', () => {
  it('renders a canceled process as a danger (red) badge', async () => {
    const badge = await renderBadge(MeteringPointProcessState.Canceled);
    expect(badge).toHaveClass('watt-badge-danger');
    // Guards against reverting to the shared badge, where canceled is neutral.
    expect(badge).not.toHaveClass('watt-badge-neutral');
  });

  it('keeps a succeeded process as a success badge', async () => {
    const badge = await renderBadge(MeteringPointProcessState.Succeeded);
    expect(badge).toHaveClass('watt-badge-success');
    expect(badge).not.toHaveClass('watt-badge-danger');
  });

  it('keeps a pending process as a neutral badge', async () => {
    const badge = await renderBadge(MeteringPointProcessState.Pending);
    expect(badge).toHaveClass('watt-badge-neutral');
  });
});
