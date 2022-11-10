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
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Story, Meta, moduleMetadata } from '@storybook/angular';

import {
  WATT_BREADCRUMBS,
  WattBreadcrumbsComponent,
} from './watt-breadcrumbs.component';

function generateComponent(template: string) {
  @Component({
    template,
    standalone: true,
  })
  class StorybookPageComponent {}

  return StorybookPageComponent;
}

export default {
  title: 'Components/Breadcrumbs',
  decorators: [
    moduleMetadata({
      imports: [
        WATT_BREADCRUMBS,
        RouterTestingModule.withRoutes([
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
  argTypes: { onClick: { action: 'clicked' } },
} as Meta;

export const Overview: Story<WattBreadcrumbsComponent> = (args) => ({
  props: args,
  template: `
    <p>"Components" has a click handler, see actions tab.</p>
    <p>"Breadcrumbs" has a routerLink.</p>
    <p>"Overview" has neither.</p>

    <watt-breadcrumbs>
      <watt-breadcrumb (click)="onClick()">Components</watt-breadcrumb>
      <watt-breadcrumb [routerLink]="['breadcrumbs']">Breadcrumbs</watt-breadcrumb>
      <watt-breadcrumb>Overview</watt-breadcrumb>
    </watt-breadcrumbs>

    <router-outlet></router-outlet>
  `,
});
