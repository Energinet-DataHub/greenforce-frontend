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
import { Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular';
import { APP_BASE_HREF } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Router, RouterModule, provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

import { WattNavListComponent, WattNavListItemComponent } from './nav-list';
import { WattShellComponent } from './shell.component';

const meta: Meta<WattShellComponent> = {
  title: 'Components/Shell',
  component: WattShellComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), provideLocationMocks()],
    }),
    moduleMetadata({
      imports: [RouterModule, WattShellComponent, WattNavListComponent, WattNavListItemComponent],
    }),
  ],
};

export default meta;

//👇 We create a “template” of how args map to rendering
const Template: StoryFn<WattShellComponent> = (args) => ({
  props: args,
});

//👇 Each story then reuses that template
export const Shell = Template.bind({});
Shell.storyName = 'Empty';

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

export const WithContent = () => ({
  template: withContentTemplate,
});
WithContent.storyName = 'With content';
WithContent.parameters = {
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

let index = 1;

function generateComponent(template: string) {
  @Component({
    selector: `watt-storybook-${index++}`,
    template,
    standalone: true,
  })
  class StorybookPageComponent {}

  return StorybookPageComponent;
}

export const WithSidebarNavigation = () => ({
  template: withSidebarNavigationTemplate,
});
WithSidebarNavigation.storyName = 'With sidebar navigation';
WithSidebarNavigation.decorators = [
  applicationConfig({
    providers: [
      provideRouter([
        { path: '', redirectTo: 'menu-2', pathMatch: 'full' },
        { path: 'menu-1', component: generateComponent('Page 1') },
        { path: 'menu-2', component: generateComponent('Page 2') },
        { path: 'menu-3', component: generateComponent('Page 3') },
        { path: 'menu-4', component: generateComponent('Page 4') },
        { path: 'menu-5', component: generateComponent('Page 5') },
        { path: 'menu-6', component: generateComponent('Page 6') },
      ]),
    ],
  }),
  moduleMetadata({
    imports: [WattNavListComponent, WattNavListItemComponent],
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
WithSidebarNavigation.parameters = {
  docs: {
    source: {
      code: withSidebarNavigationTemplate,
    },
  },
};
