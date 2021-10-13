/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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

Alternative (CSS class)
${typographyHtmlSnippets.h1.class}

Alternative (SCSS mixin)
${typographyHtmlSnippets.h1.mixin}
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

Alternative (CSS class)
${typographyHtmlSnippets.h2.class}

Alternative (SCSS mixin)
${typographyHtmlSnippets.h2.mixin}
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

Alternative (CSS class)
${typographyHtmlSnippets.h3.class}

Alternative (SCSS mixin)
${typographyHtmlSnippets.h3.mixin}
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

Alternative (CSS class)
${typographyHtmlSnippets.h4.class}

Alternative (SCSS mixin)
${typographyHtmlSnippets.h4.mixin}
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

Alternative (CSS class)
${typographyHtmlSnippets.h5.class}

Alternative (SCSS mixin)
${typographyHtmlSnippets.h5.mixin}
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

const textLCodeExample = `
CSS class
${typographyHtmlSnippets.textL.class}

SCSS mixin
${typographyHtmlSnippets.textL.mixin}
`;

export const textL = () => ({
  template: typographyHtmlSnippets.textL.class,
});
textL.storyName = 'Lead (text-l)';
textL.parameters = {
  docs: {
    source: {
      code: textLCodeExample,
    },
  },
};

const bodyTextMCodeExample = `
Recommended
${typographyHtmlSnippets.bodyTextM.tag}

Alternative (CSS class)
${typographyHtmlSnippets.bodyTextM.class}

Alternative (SCSS mixin)
${typographyHtmlSnippets.bodyTextM.mixin}
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

const textSCodeExample = `
Recommended
${typographyHtmlSnippets.textS.tag}

Alternative (SCSS mixin)
${typographyHtmlSnippets.textS.mixin}
`;

export const textS = () => ({
  template: typographyHtmlSnippets.textS.tag,
});
textS.storyName = 'Body (text-s)';
textS.parameters = {
  docs: {
    source: {
      code: textSCodeExample,
    },
  },
};

const textXsCodeExample = `
CSS class
${typographyHtmlSnippets.textXs.class}

SCSS mixin
${typographyHtmlSnippets.textXs.mixin}
`;

export const textXs = () => ({
  template: typographyHtmlSnippets.textXs.class,
});
textXs.storyName = 'Extra small (text-xs)';
textXs.parameters = {
  docs: {
    source: {
      code: textXsCodeExample,
    },
  },
};

const buttonCodeExample = `
Recommended
${typographyHtmlSnippets.button.tag}

Alternative (CSS Class)
${typographyHtmlSnippets.button.class}

Alternative (SCSS mixin)
${typographyHtmlSnippets.button.mixin}
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

Alternative (CSS Class)
${typographyHtmlSnippets.label.class}

Alternative (SCSS mixin)
${typographyHtmlSnippets.label.mixin}
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
