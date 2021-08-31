import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { typographyHtmlSnippets } from './shared/styles';
import { TypographyComponent } from './typography.component';
import { TypographyModule } from './typography.module';

export default {
  title: 'Foundations/Typography',
  component: TypographyComponent,
  decorators: [
    moduleMetadata({
      imports: [TypographyModule],
    }),
  ],
} as Meta<TypographyComponent>;

//👇 We create a “template” of how args map to rendering
const Template: Story<TypographyComponent> = (args) => ({
  props: args,
});

//👇 Each story then reuses that template
export const Typography = Template.bind({});
Typography.storyName = 'Typography - Options';
Typography.parameters = {
  docs: {
    page: null,
  },
};

const typographyUsageTemplate = `
${typographyHtmlSnippets.h1}

${typographyHtmlSnippets.h2}

${typographyHtmlSnippets.h3}

${typographyHtmlSnippets.h4}

${typographyHtmlSnippets.h5}

${typographyHtmlSnippets.textL}

${typographyHtmlSnippets.bodyTextM}

${typographyHtmlSnippets.textS}

${typographyHtmlSnippets.textXs}

${typographyHtmlSnippets.button}

${typographyHtmlSnippets.label}
`;

export const TypographyUsage = () => ({
  template: typographyUsageTemplate,
});
TypographyUsage.storyName = 'Typography - Usage';
TypographyUsage.parameters = {
  docs: {
    source: {
      code: typographyUsageTemplate,
    },
  },
};
