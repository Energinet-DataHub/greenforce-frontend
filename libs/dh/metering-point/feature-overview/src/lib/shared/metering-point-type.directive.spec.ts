/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { render, screen } from '@testing-library/angular';
import { MatcherOptions } from '@testing-library/dom';
import {
  DhMeteringPointTypeDirectiveScam,
  MeteringPointTypeDirective,
} from './metering-point-type.directive';

describe('MeteringPointTypeDirective', () => {
  beforeEach(() => MeteringPointTypeDirective);

  it('renders div', async () => {
    await render(
      `
      <div *dhMeteringPointType="'E17'; content:'netSettlementGroup'" data-testid='1'>
        test
      </div>
      `,
      { imports: [DhMeteringPointTypeDirectiveScam] }
    );
    const disableQuerySuggestions: MatcherOptions = { suggest: false };
    expect(screen.getByTestId("1", disableQuerySuggestions).textContent).toContain("test");
  });

  it('does not render div', async () => {
    await render(
      `
      <div data-testid='1'>
        <div *dhMeteringPointType="'E20'; content:'netSettlementGroup'">
          test
        </div>
      </div>
      `,
      { imports: [DhMeteringPointTypeDirectiveScam] }
    );
    const disableQuerySuggestions: MatcherOptions = { suggest: false };
    expect(screen.getByTestId("1", disableQuerySuggestions).textContent).not.toContain("test");
  });
});
