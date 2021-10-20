import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { WattBadgeComponent, WattBadgeModule } from './../index';

export default {
  title: 'Components/Badge',
  decorators: [
    moduleMetadata({
      imports: [WattBadgeModule],
    }),
  ],
  component: WattBadgeComponent,
} as Meta<WattBadgeComponent>;

export const overview: Story<WattBadgeComponent> = (args) => ({
  props: args,
  template: `
  <watt-badge>Default</watt-badge>
  <br />
  <watt-badge type="warning">Warning</watt-badge>
  <br />
  <watt-badge type="danger">Danger</watt-badge>
  <br />
  <watt-badge type="success">Success</watt-badge>
  <br />
  <watt-badge type="info">Info</watt-badge>
  `,
});
overview.parameters = {
  docs: {
    source: {
      code: 'Nothing to see here.',
    },
  },
};
overview.argTypes = {
  type: {
    control: false,
  },
};

const template: Story<WattBadgeComponent> = (args) => ({
  props: args,
  template: `<watt-badge type="${args.type}">${args.type}</watt-badge>`,
});

export const warning = template.bind({});
warning.args = {
  type: 'warning',
};

export const danger = template.bind({});
danger.args = {
  type: 'danger',
};

export const success = template.bind({});
success.args = {
  type: 'success',
};

export const info = template.bind({});
info.args = {
  type: 'info',
};
