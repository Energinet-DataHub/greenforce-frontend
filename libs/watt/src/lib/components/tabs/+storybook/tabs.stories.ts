import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import { WattTabsComponent, WattTabComponent, WattTabsActionComponent } from './../index';
import { WattButtonComponent } from '../../button/watt-button.component';

const meta: Meta<WattTabsComponent> = {
  title: 'Components/Tabs',
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [WattTabComponent, WattTabsActionComponent, WattButtonComponent],
    }),
  ],
  component: WattTabsComponent,
};

export default meta;

const template = `<watt-tabs>
  <watt-tab label="First">Some awesome content for the first tab</watt-tab>
  <watt-tab label="Second">Some awesome content for the second tab</watt-tab>
  <watt-tab label="Third">Some awesome content for the third tab</watt-tab>

  <watt-tabs-action>
    <watt-button variant="secondary">Tab action</watt-button>
  </watt-tabs-action>
</watt-tabs>

<watt-tabs variant="secondary">
  <watt-tab label="First">Some awesome content for the first tab</watt-tab>
  <watt-tab label="Second">Some awesome content for the second tab</watt-tab>
  <watt-tab label="Third">Some awesome content for the third tab</watt-tab>

  <watt-tabs-action>
    <watt-button variant="secondary">Tab action</watt-button>
  </watt-tabs-action>
</watt-tabs>`;

export const Tabs: StoryFn<WattTabsComponent> = (args) => ({
  props: args,
  template,
});

Tabs.parameters = {
  docs: {
    source: {
      code: template,
    },
  },
};
