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

import { APP_INITIALIZER, Component } from '@angular/core';
import { Meta, Story, moduleMetadata } from '@storybook/angular';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { WattNavListComponent, WattNavListItemComponent } from './nav-list';
import { WattShellComponent } from './shell.component';
import { WattTopBarComponent, WattTopBarOutletComponent } from './top-bar';

export default {
  title: 'Components/Shell',
  component: WattShellComponent,
  decorators: [
    moduleMetadata({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        WattShellComponent,
        WattTopBarOutletComponent,
      ],
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
      <watt-nav-list-item link="https://angular.io/" target="_blank">External links (angular.io)</watt-nav-list-item>
    </watt-nav-list>

    <watt-nav-list [expandable]="true" [title]="'Nested menu'">
      <watt-nav-list-item link="/menu-4">Menu 4</watt-nav-list-item>
      <watt-nav-list-item link="/menu-5">Menu 5</watt-nav-list-item>
      <watt-nav-list-item link="/menu-6">Menu 6</watt-nav-list-item>
    </watt-nav-list>
  </ng-container>

  <ng-container watt-shell-toolbar>
    Toolbar
  </ng-container>

  <router-outlet></router-outlet>
</watt-shell>
`;

function generateComponent(template: string) {
  @Component({
    template,
    standalone: true,
    imports: [WattTopBarComponent],
  })
  class StorybookPageComponent {}

  return StorybookPageComponent;
}

export const withSidebarNavigation = () => ({
  template: withSidebarNavigationTemplate,
});
withSidebarNavigation.storyName = 'With sidebar navigation';
withSidebarNavigation.decorators = [
  moduleMetadata({
    imports: [
      RouterTestingModule.withRoutes([
        { path: '', redirectTo: 'menu-2', pathMatch: 'full' },
        { path: 'menu-1', component: generateComponent('Page 1') },
        { path: 'menu-2', component: generateComponent('Page 2') },
        { path: 'menu-3', component: generateComponent('Page 3') },
        { path: 'menu-4', component: generateComponent('Page 4') },
        { path: 'menu-5', component: generateComponent('Page 5') },
        { path: 'menu-6', component: generateComponent('Page 6') },
      ]),
      WattNavListComponent,
      WattNavListItemComponent,
    ],
    providers: [
      {
        provide: APP_BASE_HREF,
        useValue: '/iframe.html/',
      },
      // Perform the initial navigation. Without it the redirect in the route definition will not happen
      {
        provide: APP_INITIALIZER,
        useFactory: (router: Router) => () => router.initialNavigation(),
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

const withTopBarTemplate = `
<watt-shell>
  <ng-container watt-shell-sidenav>
    <watt-nav-list>
      <watt-nav-list-item link="/with-top-bar">Page with top bar</watt-nav-list-item>
      <watt-nav-list-item link="/without-top-bar">Page without top bar</watt-nav-list-item>
    </watt-nav-list>
  </ng-container>

  <ng-container watt-shell-toolbar>
    Toolbar
  </ng-container>

  <watt-top-bar-outlet></watt-top-bar-outlet>

  <router-outlet></router-outlet>
</watt-shell>
`;

export const withTopBar = () => ({
  template: withTopBarTemplate,
});
withTopBar.storyName = 'With top bar';
withTopBar.decorators = [
  moduleMetadata({
    imports: [
      RouterTestingModule.withRoutes([
        { path: '', redirectTo: 'with-top-bar', pathMatch: 'full' },
        {
          path: 'with-top-bar',
          component: generateComponent(
            '<watt-top-bar>Top Bar</watt-top-bar> This page has a top bar'
          ),
        },
        {
          path: 'without-top-bar',
          component: generateComponent('This page does not have a top bar'),
        },
      ]),
      WattNavListComponent,
      WattNavListItemComponent,
    ],
    providers: [
      {
        provide: APP_BASE_HREF,
        useValue: '/iframe.html/',
      },
      // Perform the initial navigation. Without it the redirect in the route definition will not happen
      {
        provide: APP_INITIALIZER,
        useFactory: (router: Router) => () => router.initialNavigation(),
        deps: [Router],
        multi: true,
      },
    ],
  }),
];
withTopBar.parameters = {
  docs: {
    source: {
      code: `
        <!-- Add inside the watt-shell component -->
        <watt-top-bar-outlet></watt-top-bar-outlet>

        <!-- Import the WattTopBarComponent inside the "page" component -->
        import { WattTopBarComponent } from '@energinet-datahub/watt/top-bar';

        <!-- Add the WattTopBarComponent to the "page" component or module metadata -->
        imports: [WattTopBarComponent]

        <!-- Add inside the "page" component (remember to import the topbar component ) -->
        <watt-top-bar>Some awesome top bar content</watt-top-bar>
      `,
    },
  },
};
