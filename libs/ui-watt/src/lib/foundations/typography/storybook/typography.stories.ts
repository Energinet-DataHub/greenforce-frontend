import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { typographyHtmlSnippets } from './shared/styles';
import { TypographyComponent } from './typography.component';
import { TypographyModule } from './typography.module';

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
Typography.storyName = 'Overview';
Typography.parameters = {
  docs: {
    //page: null,
    source: {
      code: typographyUsageTemplate
    }
  },
};

export const h1 = () => ({
  template: typographyHtmlSnippets.h1,
});
h1.storyName = 'Headline 1';
h1.parameters = {
  docs: {
    source: {
      code: typographyHtmlSnippets.h1,
    },
  },
};

export const h2 = () => ({
  template: typographyHtmlSnippets.h2,
});
h2.storyName = 'Headline 2';
h2.parameters = {
  docs: {
    source: {
      code: typographyHtmlSnippets.h2,
    },
  },
};

export const h3 = () => ({
  template: typographyHtmlSnippets.h3,
});
h3.storyName = 'Headline 3';
h3.parameters = {
  docs: {
    source: {
      code: typographyHtmlSnippets.h3,
    },
  },
};

export const h4 = () => ({
  template: typographyHtmlSnippets.h4,
});
h4.storyName = 'Headline 4';
h4.parameters = {
  docs: {
    source: {
      code: typographyHtmlSnippets.h4,
    },
  },
};

export const h5 = () => ({
  template: typographyHtmlSnippets.h5,
});
h5.storyName = 'Headline 5';
h5.parameters = {
  docs: {
    source: {
      code: typographyHtmlSnippets.h5,
    },
  },
};

export const textL = () => ({
  template: typographyHtmlSnippets.textL,
});
textL.storyName = 'Lead (text-l)';
textL.parameters = {
  docs: {
    source: {
      code: typographyHtmlSnippets.textL,
    },
  },
};

export const bodyTextM = () => ({
  template: typographyHtmlSnippets.bodyTextM,
});
bodyTextM.storyName = 'Body (text-m)';
bodyTextM.parameters = {
  docs: {
    source: {
      code: typographyHtmlSnippets.bodyTextM,
    },
  },
};

export const textS = () => ({
  template: typographyHtmlSnippets.textS,
});
textS.storyName = 'Body (text-s)';
textS.parameters = {
  docs: {
    source: {
      code: typographyHtmlSnippets.textS,
    },
  },
};

export const textXs = () => ({
  template: typographyHtmlSnippets.textXs,
});
textXs.storyName = 'Extra small (text-xs)';
textXs.parameters = {
  docs: {
    source: {
      code: typographyHtmlSnippets.textXs,
    },
  },
};

export const button = () => ({
  template: typographyHtmlSnippets.button,
});
button.storyName = 'Button';
button.parameters = {
  docs: {
    source: {
      code: typographyHtmlSnippets.button,
    },
  },
};

export const label = () => ({
  template: typographyHtmlSnippets.label,
});
label.storyName = 'Label';
label.parameters = {
  docs: {
    source: {
      code: typographyHtmlSnippets.label,
    },
  },
};


