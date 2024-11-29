import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import { WattLinkTabsComponent, WattLinkTabComponent } from './../index';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter, Router, RouterModule } from '@angular/router';
import { APP_INITIALIZER, Component } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

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

const meta: Meta<WattLinkTabsComponent> = {
  title: 'Components/Tabs',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        provideLocationMocks(),
        provideRouter([
          { path: '', redirectTo: 'menu-1', pathMatch: 'full' },
          { path: 'menu-1', component: generateComponent('Page 1') },
          { path: 'menu-2', component: generateComponent('Page 2') },
          { path: 'menu-3', component: generateComponent('Page 3') },
        ]),
      ],
    }),
    moduleMetadata({
      imports: [RouterModule, WattLinkTabComponent],
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
  component: WattLinkTabsComponent,
};

export default meta;

const template = `<watt-link-tabs>
  <watt-link-tab label="First" link="/menu-1" />
  <watt-link-tab label="Second" link="/menu-2" />
  <watt-link-tab label="Third" link="/menu-3" />
</watt-link-tabs>`;

export const LinkTabs: StoryFn<WattLinkTabsComponent> = (args) => ({
  props: args,
  template,
});

LinkTabs.parameters = {
  docs: {
    source: {
      code: template,
    },
  },
};
