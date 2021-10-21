import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { WattTabsComponent, WattTabsModule } from './../index';

export default {
  title: 'Components/Tabs',
  decorators: [
    moduleMetadata({
      imports: [WattTabsModule],
    }),
  ],
  component: WattTabsComponent,
} as Meta<WattTabsComponent>;

export const tabs: Story<WattTabsComponent> = (args) => ({
  props: args,
  template: `<watt-tabs>
  <watt-tab label="First">Some awesome content for the first tab</watt-tab>
  <watt-tab label="Second">Some awesome content for the second tab</watt-tab>
  <watt-tab label="Third">Some awesome content for the third tab</watt-tab>
</watt-tabs>`
});