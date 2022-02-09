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
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { WattShellComponent } from './shell.component';
import { WattShellModule } from './shell.module';
import { WattNavListModule } from './nav-list';

export default {
  title: 'Components/Shell',
  component: WattShellComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, WattShellModule],
    }),
  ],
} as Meta<WattShellComponent>;

//👇 We create a “template” of how args map to rendering
const Template: Story<WattShellComponent> = (args) => ({
  props: args,
});

//👇 Each story then reuses that template
export const shell = Template.bind({});
shell.storyName = 'Empty';

const withContentTemplate = `
<watt-shell>
  <ng-container watt-shell-sidenav>
    Sidenav
  </ng-container>

  <ng-container watt-shell-toolbar>
    Toolbar
  </ng-container>

  Main content
</watt-shell>
`;

export const withContent = () => ({
  template: withContentTemplate,
});
withContent.storyName = 'With content';
withContent.parameters = {
  docs: {
    source: {
      code: withContentTemplate,
    },
  },
};

const withSidebarNavigationTemplate = `
<watt-shell>
  <ng-container watt-shell-sidenav>
    <watt-nav-list>
      <a
        watt-nav-list-item
        routerLink="/menu-1"
        routerLinkActive="active"
        >Menu 1</a
      >
      <a
        watt-nav-list-item
        routerLink="/menu-2"
        routerLinkActive="active"
        >Menu 2</a
      >
    </watt-nav-list>
  </ng-container>

  <ng-container watt-shell-toolbar>
    Toolbar
  </ng-container>

  <router-outlet></router-outlet>
</watt-shell>
`;

@Component({
  template: 'Menu 1',
})
class StorybookMenu1Component {}

@Component({
  template: 'Menu 2',
})
class StorybookMenu2Component {}

export const withSidebarNavigation = () => ({
  template: withSidebarNavigationTemplate,
});
withSidebarNavigation.storyName = 'With sidebar navigation';
withSidebarNavigation.decorators = [
  moduleMetadata({
    imports: [
      RouterModule.forRoot(
        [
          { path: '', redirectTo: 'menu-1', pathMatch: 'full' },
          { path: 'menu-1', component: StorybookMenu1Component },
          { path: 'menu-2', component: StorybookMenu2Component },
        ],
        {
          useHash: true,
        }
      ),
      WattNavListModule,
    ],
    providers: [
      {
        provide: APP_BASE_HREF,
        useValue: '/iframe.html/',
      },
    ],
  }),
];
withSidebarNavigation.parameters = {
  docs: {
    source: {
      code: withSidebarNavigationTemplate,
    },
  },
};
