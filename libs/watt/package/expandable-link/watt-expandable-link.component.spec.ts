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
import { Component, signal } from '@angular/core';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { WattExpandableLinkComponent } from './watt-expandable-link.component';

const BODY_TEXT = 'Hidden body content';
const LABEL_EXPANDED = 'Skjul indhold';
const LABEL_COLLAPSED = 'Vis indhold';

const template = `
  <watt-expandable-link
    labelExpanded="${LABEL_EXPANDED}"
    labelCollapsed="${LABEL_COLLAPSED}"
  >
    <p>${BODY_TEXT}</p>
  </watt-expandable-link>
`;

describe(WattExpandableLinkComponent, () => {
  async function setup() {
    return render(template, {
      imports: [WattExpandableLinkComponent],
    });
  }

  it('renders collapsed by default with the collapsed label and inert content', async () => {
    await setup();

    expect(
      screen.getByRole('button', { expanded: false, name: LABEL_COLLAPSED })
    ).toBeInTheDocument();
    expect(screen.getByText(BODY_TEXT).closest('[inert]')).not.toBeNull();
  });

  it('expands on click, swapping the label and making the content interactive', async () => {
    await setup();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button'));

    expect(
      screen.getByRole('button', { expanded: true, name: LABEL_EXPANDED })
    ).toBeInTheDocument();
    expect(screen.getByText(BODY_TEXT).closest('[inert]')).toBeNull();
  });

  it('collapses again on a second click', async () => {
    await setup();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button'));

    expect(
      screen.getByRole('button', { expanded: false, name: LABEL_COLLAPSED })
    ).toBeInTheDocument();
    expect(screen.getByText(BODY_TEXT).closest('[inert]')).not.toBeNull();
  });

  it('falls back to the collapsed label when labelExpanded is omitted', async () => {
    await render(
      `<watt-expandable-link labelCollapsed="${LABEL_COLLAPSED}">
        <p>${BODY_TEXT}</p>
      </watt-expandable-link>`,
      { imports: [WattExpandableLinkComponent] }
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

  it('reflects the toggle in a parent two-way bound signal', async () => {
    @Component({
      imports: [WattExpandableLinkComponent],
      template: `
        <watt-expandable-link
          [(expanded)]="expanded"
          labelExpanded="${LABEL_EXPANDED}"
          labelCollapsed="${LABEL_COLLAPSED}"
        >
          <p>${BODY_TEXT}</p>
        </watt-expandable-link>
      `,
    })
    class HostComponent {
      readonly expanded = signal(false);
    }

    const { fixture } = await render(HostComponent);
    const user = userEvent.setup();

    expect(fixture.componentInstance.expanded()).toBe(false);

    await user.click(screen.getByRole('button'));

    expect(fixture.componentInstance.expanded()).toBe(true);
  });
});
