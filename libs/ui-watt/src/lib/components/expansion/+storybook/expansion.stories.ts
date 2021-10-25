import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { WattExpansionComponent, WattExpansionModule } from './../index';

export default {
  title: 'Components/Expansion Panel',
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, WattExpansionModule],
    }),
  ],
  component: WattExpansionComponent,
} as Meta<WattExpansionComponent>;

const template: Story<WattExpansionComponent> = (args) => ({
  props: args,
  template: `<watt-expansion openLabel="${args.openLabel}" closeLabel="${args.closeLabel}" expanded="${args.expanded}">
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil assumenda sint similique maiores aliquam consectetur earum, qui facere delectus distinctio perferendis dolorum officia numquam ipsa architecto mollitia debitis sed exercitationem.
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil assumenda sint similique maiores aliquam consectetur earum, qui facere delectus distinctio perferendis dolorum officia numquam ipsa architecto mollitia debitis sed exercitationem.
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil assumenda sint similique maiores aliquam consectetur earum, qui facere delectus distinctio perferendis dolorum officia numquam ipsa architecto mollitia debitis sed exercitationem.
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil assumenda sint similique maiores aliquam consectetur earum, qui facere delectus distinctio perferendis dolorum officia numquam ipsa architecto mollitia debitis sed exercitationem.
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil assumenda sint similique maiores aliquam consectetur earum, qui facere delectus distinctio perferendis dolorum officia numquam ipsa architecto mollitia debitis sed exercitationem.
  </watt-expansion>`,
});

export const collapsed = template.bind({});
collapsed.parameters = {
  docs: {
    source: {
      code: '<watt-expansion openLabel="Show more" closeLabel="Show less">YOUR AMAZING CONTENT</watt-expansion>',
    },
  },
};
collapsed.args = {
  openLabel: 'Show more',
  closeLabel: 'Show less',
  expanded: false,
};

export const expanded = template.bind({});
expanded.args = {
  openLabel: 'Show more',
  closeLabel: 'Show less',
  expanded: true,
};
expanded.parameters = {
  docs: {
    source: {
      code: '<watt-expansion openLabel="Show more" closeLabel="Show less" expanded="true">YOUR AMAZING CONTENT</watt-expansion>',
    },
  },
};
