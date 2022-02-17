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
import { Router } from '@angular/router';
import { APP_INITIALIZER, Component } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
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
      <watt-nav-list-item link="/menu-1">Menu 1</watt-nav-list-item>
      <watt-nav-list-item link="/menu-2">Menu 2</watt-nav-list-item>
      <watt-nav-list-item link="/menu-3">Menu 3</watt-nav-list-item>
    </watt-nav-list>
  </ng-container>

  <ng-container watt-shell-toolbar>
    Toolbar
  </ng-container>

  <router-outlet></router-outlet>
</watt-shell>
`;

@Component({
  template: 'Page 1',
})
class StorybookPage1Component {}

@Component({
  template: 'Page 2',
})
class StorybookPage2Component {}

@Component({
  template: 'Page 3',
})
class StorybookPage3Component {}

export const withSidebarNavigation = () => ({
  template: withSidebarNavigationTemplate,
});
withSidebarNavigation.storyName = 'With sidebar navigation';
withSidebarNavigation.decorators = [
  moduleMetadata({
    imports: [
      RouterTestingModule.withRoutes(
        [
          { path: 'menu-1', component: StorybookPage1Component },
          { path: 'menu-2', component: StorybookPage2Component },
          { path: 'menu-3', component: StorybookPage3Component },
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
      // Initial navigation. Using a redirect in the route definition doesn't work
      {
        provide: APP_INITIALIZER,
        useFactory: (router: Router) => () => router.navigate(['/menu-2']),
        deps: [Router],
        multi: true,
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
