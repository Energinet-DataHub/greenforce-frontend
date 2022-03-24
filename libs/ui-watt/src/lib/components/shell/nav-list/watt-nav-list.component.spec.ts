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

import { render, screen } from '@testing-library/angular';

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WattNavListModule } from './watt-nav-list.component';

describe(WattNavListModule.name, () => {
  it('exports shared Watt Design System nav list', async () => {
    const text = 'Page 1';

    const view = await render(
      `
      <watt-nav-list>
        <watt-nav-list-item link="/">
          ${text}
        </watt-nav-list-item>
      </watt-nav-list>
    `,
      {
        imports: [WattNavListModule],
      }
    );

    expect(view.queryByText(text)).not.toBeNull();
  });

  it('adds "active" class when a route path is activated', async () => {
    @Component({
      template: '<h2>Page route</h2>',
    })
    class TestPageComponent {}

    const view = await render(
      `
      <watt-nav-list>
        <watt-nav-list-item link="/default-page">Default page</watt-nav-list-item>
        <watt-nav-list-item link="/other-page">Other page</watt-nav-list-item>
      </watt-nav-list>
      <router-outlet></router-outlet>
    `,
      {
        declarations: [TestPageComponent],
        imports: [WattNavListModule, RouterModule],
        routes: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'default-page',
          },
          {
            path: 'default-page',
            component: TestPageComponent,
          },
          {
            path: 'other-page',
            component: TestPageComponent,
          },
        ],
      }
    );

    const activeClass = 'active';
    const otherPageLink = await screen.findByRole('link', {
      name: /other page/i,
    });

    await view.navigate('/');

    expect(otherPageLink).not.toHaveClass(activeClass);

    await view.navigate(otherPageLink);

    expect(otherPageLink).toHaveClass(activeClass);
  });

  it('Supports external links', async () => {
    // Arrange
    await render(
      `
      <watt-nav-list>
        <watt-nav-list-item link="https://energinet.dk">
          Energinet
        </watt-nav-list-item>
      </watt-nav-list>
    `,
      {
        imports: [WattNavListModule],
      }
    );

    // Act

    // Assert
    expect(
      await screen.findByRole('link', {
        name: /energinet/i,
      })
    ).toHaveAttribute('href', 'https://energinet.dk');
  });

  describe('Description goes here', () => {
    const setup = async (target: string | null) => {
      // Arrange
      await render(
        `
        <watt-nav-list>
          <watt-nav-list-item link="https://energinet.dk" [target]="target">
            Energinet
          </watt-nav-list-item>
        </watt-nav-list>
      `,
        {
          imports: [WattNavListModule],
          componentProperties: {
            target,
          },
        }
      );
    };

    it('Opens external links in a new browser tab, when specified', async () => {
      // Arrange
      await setup('_blank');
      // Act
      // Assert
      const link = await screen.findByRole('link', {
        name: /energinet/i,
      });
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('Opens external links in the same browser tab by default', async () => {
      await setup(null);
      // Act
      // Assert
      const link = await screen.findByRole('link', {
        name: /energinet/i,
      });
      expect(link).not.toHaveAttribute('target');
    });
  });
});
