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
import { MatExpansionPanelHarness } from '@angular/material/expansion/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { WattNavListComponent } from './watt-nav-list.component';
import { WattNavListItemComponent } from './watt-nav-list-item.component';

const httpEnerginetDkUrl = 'http://energinet.dk';
const httpsEnerginetDkUrl = 'https://energinet.dk';

describe(WattNavListComponent.name, () => {
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
        imports: [WattNavListComponent, WattNavListItemComponent],
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
        imports: [WattNavListComponent, WattNavListItemComponent, RouterModule],
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
        <watt-nav-list-item link="${httpsEnerginetDkUrl}">
          Energinet
        </watt-nav-list-item>
      </watt-nav-list>
    `,
      {
        imports: [WattNavListComponent, WattNavListItemComponent],
      }
    );

    // Act

    // Assert
    expect(
      await screen.findByRole('link', {
        name: /energinet/i,
      })
    ).toHaveAttribute('href', httpsEnerginetDkUrl);
  });

  describe(`${WattNavListComponent.name} - Ensures external links are specified with the expected protocol`, () => {
    const setup = async (link: string) => {
      // Arrange
      await render(
        `
        <watt-nav-list>
          <watt-nav-list-item [link]="link">
            Energinet
          </watt-nav-list-item>
        </watt-nav-list>
      `,
        {
          imports: [WattNavListComponent, WattNavListItemComponent],
          componentProperties: {
            link,
          },
        }
      );
    };

    it('Ensures external links are specified with the https protocol', async () => {
      // Arrange
      await setup(httpsEnerginetDkUrl);
      // Act
      // Assert
      const link = await screen.findByRole('link', {
        name: /energinet/i,
      });
      expect(link).toHaveAttribute('href', httpsEnerginetDkUrl);
    });

    it('Ensures external links are specified with the http protocol', async () => {
      // Arrange
      await setup(httpEnerginetDkUrl);
      // Act
      // Assert
      const link = await screen.findByRole('link', {
        name: /energinet/i,
      });
      expect(link).toHaveAttribute('href', httpEnerginetDkUrl);
    });
  });

  describe('Verify links added with href attribute opens in expected windows', () => {
    const setup = async (target: string | null) => {
      // Arrange
      await render(
        `
        <watt-nav-list>
          <watt-nav-list-item link="${httpsEnerginetDkUrl}" [target]="target">
            Energinet
          </watt-nav-list-item>
        </watt-nav-list>
      `,
        {
          imports: [WattNavListComponent, WattNavListItemComponent],
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
      // Arrange
      await setup(null);
      // Act
      // Assert
      const link = await screen.findByRole('link', {
        name: /energinet/i,
      });
      expect(link).not.toHaveAttribute('target');
    });
  });

  describe('Supports expandable nav list', () => {
    it('can set a title on an expandable nav list', async () => {
      const title = 'Expandable menu';

      const view = await render(
        `
        <watt-nav-list [title]="'${title}'" [expandable]="true">
          <watt-nav-list-item link="/sub-page">Sub page</watt-nav-list-item>
        </watt-nav-list>
      `,
        {
          imports: [WattNavListComponent, WattNavListItemComponent],
        }
      );

      expect(view.queryByText(title)).not.toBeNull();
    });

    it('supports nav list items in an expandable nav list', async () => {
      const text = 'Sub page';

      const view = await render(
        `
        <watt-nav-list [title]="'Title'" [expandable]="true">
          <watt-nav-list-item link="/sub-page">${text}</watt-nav-list-item>
        </watt-nav-list>
      `,
        {
          imports: [WattNavListComponent, WattNavListItemComponent],
        }
      );

      expect(view.queryByText(text)).not.toBeNull();
    });

    it('expands the nav list automatically when navigating to a sub page', async () => {
      function generateComponent(content = '') {
        @Component({
          template: `<h2>${content}</h2>`,
          standalone: true,
        })
        class TestPageComponent {}

        return TestPageComponent;
      }

      const view = await render(
        `
        <watt-nav-list>
          <watt-nav-list-item link="/top-page">Top page</watt-nav-list-item>
        </watt-nav-list>

        <watt-nav-list [title]="'Title'" [expandable]="true">
          <watt-nav-list-item link="/sub-page">Sub page</watt-nav-list-item>
        </watt-nav-list>
        <router-outlet></router-outlet>
      `,
        {
          imports: [
            WattNavListComponent,
            WattNavListItemComponent,
            RouterModule,
          ],
          routes: [
            {
              path: 'top-page',
              component: generateComponent('Top page'),
            },
            {
              path: 'sub-page',
              component: generateComponent('Sub page'),
            },
          ],
        }
      );

      const loader = TestbedHarnessEnvironment.loader(view.fixture);
      const expansionPanel = await loader.getHarness(MatExpansionPanelHarness);

      const activeClass = 'active';
      const topPageLink = await screen.findByRole('link', {
        name: /top page/i,
      });
      const findSubPageLink = () =>
        screen.findByRole('link', {
          name: /sub page/i,
        });

      expect(await expansionPanel.isExpanded()).toBeFalsy();

      await view.navigate('/sub-page');

      expect(await expansionPanel.isExpanded()).toBeTruthy();

      const subPageLink = await findSubPageLink();

      expect(subPageLink).toHaveClass(activeClass);
      expect(subPageLink).toBeVisible();

      await view.navigate(topPageLink);

      expect(subPageLink).not.toHaveClass(activeClass);
      expect(await expansionPanel.isExpanded()).toBeTruthy();
    });
  });
});
