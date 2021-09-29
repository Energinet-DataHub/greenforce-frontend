import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { typographyHtmlSnippets } from './shared/typography-html-snippets';
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
const emptySourceCodeBlock = ' ';
Typography.storyName = 'Overview';
Typography.parameters = {
  docs: {
    source: {
      code: emptySourceCodeBlock,
    },
  },
};

const h1CodeExample = `
Recommended
${typographyHtmlSnippets.h1.tag}

Alternative
${typographyHtmlSnippets.h1.class}
`;

export const h1 = () => ({
  template: typographyHtmlSnippets.h1.tag,
});
h1.storyName = 'Headline 1';
h1.parameters = {
  docs: {
    source: {
      code: h1CodeExample,
    },
  },
};

const h2CodeExample = `
Recommended
${typographyHtmlSnippets.h2.tag}

Alternative
${typographyHtmlSnippets.h2.class}
`;

export const h2 = () => ({
  template: typographyHtmlSnippets.h2.tag,
});
h2.storyName = 'Headline 2';
h2.parameters = {
  docs: {
    source: {
      code: h2CodeExample,
    },
  },
};

const h3CodeExample = `
Recommended
${typographyHtmlSnippets.h3.tag}

Alternative
${typographyHtmlSnippets.h3.class}
`;

export const h3 = () => ({
  template: typographyHtmlSnippets.h3.tag,
});
h3.storyName = 'Headline 3';
h3.parameters = {
  docs: {
    source: {
      code: h3CodeExample,
    },
  },
};

const h4CodeExample = `
Recommended
${typographyHtmlSnippets.h4.tag}

Alternative
${typographyHtmlSnippets.h4.class}
`;

export const h4 = () => ({
  template: typographyHtmlSnippets.h4.tag,
});
h4.storyName = 'Headline 4';
h4.parameters = {
  docs: {
    source: {
      code: h4CodeExample,
    },
  },
};

const h5CodeExample = `
Recommended
${typographyHtmlSnippets.h5.tag}

Alternative
${typographyHtmlSnippets.h5.class}
`;

export const h5 = () => ({
  template: typographyHtmlSnippets.h5.tag,
});
h5.storyName = 'Headline 5';
h5.parameters = {
  docs: {
    source: {
      code: h5CodeExample,
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

const bodyTextMCodeExample = `
Recommended
${typographyHtmlSnippets.bodyTextM.tag}

Alternative
${typographyHtmlSnippets.bodyTextM.class}
`;

export const bodyTextM = () => ({
  template: typographyHtmlSnippets.bodyTextM.tag,
});
bodyTextM.storyName = 'Body (text-m)';
bodyTextM.parameters = {
  docs: {
    source: {
      code: bodyTextMCodeExample,
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

const buttonCodeExample = `
Recommended
${typographyHtmlSnippets.button.tag}

Alternative
${typographyHtmlSnippets.button.class}
`;

export const button = () => ({
  template: typographyHtmlSnippets.button.storybook,
});
button.storyName = 'Button';
button.parameters = {
  docs: {
    source: {
      code: buttonCodeExample,
    },
  },
};

const labelCodeExample = `
Recommended
${typographyHtmlSnippets.label.tag}

Alternative
${typographyHtmlSnippets.label.class}
`;

export const label = () => ({
  template: typographyHtmlSnippets.label.class,
});
label.storyName = 'Label';
label.parameters = {
  docs: {
    source: {
      code: labelCodeExample,
    },
  },
};
