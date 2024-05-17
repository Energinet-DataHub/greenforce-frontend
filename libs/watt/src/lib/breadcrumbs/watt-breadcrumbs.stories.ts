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
import { APP_BASE_HREF } from '@angular/common';
import { APP_INITIALIZER, Component } from '@angular/core';
import { Router, RouterModule, provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { StoryFn, Meta, moduleMetadata, applicationConfig } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

import { WATT_BREADCRUMBS, WattBreadcrumbsComponent } from './watt-breadcrumbs.component';

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

const meta: Meta<WattBreadcrumbsComponent> = {
  title: 'Components/Breadcrumbs',
  component: WattBreadcrumbsComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideLocationMocks(),
        provideRouter([
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          {
            path: 'components',
            component: generateComponent('Route:Components'),
          },
          {
            path: 'breadcrumbs',
            component: generateComponent('Route:Breadcrumbs'),
          },
          { path: 'overview', component: generateComponent('Route:Overview') },
        ]),
      ],
    }),
    moduleMetadata({
      imports: [RouterModule, WATT_BREADCRUMBS],
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
  ],
};

export default meta;

export const Overview: StoryFn<WattBreadcrumbsComponent> = (args) => ({
  props: {
    ...args,
    onClick: () => action('Breadcrumb clicked')('Click!'),
  },
  template: `
    <p>"Components" has a click handler, see "Actions" tab.</p>
    <p>"Breadcrumbs" has a routerLink.</p>
    <p>"Overview" has neither.</p>
    <br>

    <watt-breadcrumbs>
      <watt-breadcrumb (click)="onClick()">Components</watt-breadcrumb>
      <watt-breadcrumb [routerLink]="['breadcrumbs']">Breadcrumbs</watt-breadcrumb>
      <watt-breadcrumb>Overview</watt-breadcrumb>
    </watt-breadcrumbs>

    <br>
    <router-outlet></router-outlet>
  `,
});
