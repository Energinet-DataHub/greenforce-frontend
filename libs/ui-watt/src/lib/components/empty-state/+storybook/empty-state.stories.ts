import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { WattEmptyStateComponent, WattEmptyStateModule } from './../index';

export default {
  title: 'Components/Empty State',
  decorators: [
    moduleMetadata({
      imports: [WattEmptyStateModule],
    }),
  ],
  component: WattEmptyStateComponent,
} as Meta<WattEmptyStateComponent>;

export const emptyState: Story<WattEmptyStateComponent> = (args) => ({
  props: args,
});
emptyState.args = {
  icon: 'explore',
  title: 'No results for ‘test’',
  msg: 'Try adjusting your search or filter to find what you are looking for.',
};

const emptyStateWithCallBackTemplate = (
  args: Partial<WattEmptyStateComponent>
) => `<watt-empty-state icon="${args.icon}" title="${args.title}" msg="${args.msg}">
  <watt-button type="primary" size="normal">Go Back</watt-button>
</watt-empty-state>`;

export const emptyStateWithCallBack: Story<WattEmptyStateComponent> = (
  args
) => ({
  props: args,
  template: emptyStateWithCallBackTemplate(args),
});
emptyStateWithCallBack.args = {
  icon: 'power',
  title: 'An unexpected error occured',
  msg: 'Try again or contact your system administrator if you keep getting this error.',
};
emptyStateWithCallBack.parameters = {
  docs: {
    source: {
      code: emptyStateWithCallBackTemplate(emptyStateWithCallBack.args),
    },
  },
};
