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
  <watt-tab label="First"> Content 1 </watt-tab>
  <watt-tab label="Second"> Content 2 </watt-tab>
  <watt-tab label="Third"> Content 3 </watt-tab>
</watt-tabs>`
});