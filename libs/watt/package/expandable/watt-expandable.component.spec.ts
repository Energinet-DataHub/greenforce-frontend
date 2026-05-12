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
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { WattExpandableComponent } from './watt-expandable.component';
import { WATT_EXPANDABLE } from './index';

const BODY_TEXT = 'Hidden body content';
const LABEL_EXPANDED = 'Skjul mulige handlinger';
const LABEL_COLLAPSED = 'Vis mulige handlinger';

const template = `
  <watt-expandable
    labelExpanded="${LABEL_EXPANDED}"
    labelCollapsed="${LABEL_COLLAPSED}"
  >
    <p>${BODY_TEXT}</p>
  </watt-expandable>
`;

describe(WattExpandableComponent, () => {
  async function setup() {
    return render(template, {
      imports: [WATT_EXPANDABLE],
    });
  }

  function getContentRegion(): HTMLElement {
    const button = screen.getByRole('button');
    const id = button.getAttribute('aria-controls');
    if (!id) throw new Error('button is missing aria-controls');
    const region = document.getElementById(id);
    if (!region) throw new Error(`no element with id ${id}`);
    return region;
  }

  it('renders collapsed by default with the collapsed label and inert content', async () => {
    await setup();

    expect(
      screen.getByRole('button', { expanded: false, name: LABEL_COLLAPSED })
    ).toBeInTheDocument();
    expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();
    expect(getContentRegion()).toHaveAttribute('inert');
  });

  it('expands on click, swapping the label and making the content interactive', async () => {
    await setup();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button'));

    expect(
      screen.getByRole('button', { expanded: true, name: LABEL_EXPANDED })
    ).toBeInTheDocument();
    expect(getContentRegion()).not.toHaveAttribute('inert');
  });

  it('collapses again on a second click', async () => {
    await setup();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button'));

    expect(
      screen.getByRole('button', { expanded: false, name: LABEL_COLLAPSED })
    ).toBeInTheDocument();
    expect(getContentRegion()).toHaveAttribute('inert');
  });

  it('falls back to the collapsed label when labelExpanded is omitted', async () => {
    await render(
      `<watt-expandable labelCollapsed="${LABEL_COLLAPSED}">
        <p>${BODY_TEXT}</p>
      </watt-expandable>`,
      { imports: [WATT_EXPANDABLE] }
    );
    const user = userEvent.setup();

    expect(
      screen.getByRole('button', { expanded: false, name: LABEL_COLLAPSED })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button'));

    expect(
      screen.getByRole('button', { expanded: true, name: LABEL_COLLAPSED })
    ).toBeInTheDocument();
  });
});
