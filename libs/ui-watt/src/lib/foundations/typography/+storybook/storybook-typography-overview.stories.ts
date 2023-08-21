/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
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
import { Meta, StoryFn } from '@storybook/angular';

import { typographyHtmlSnippets } from './shared/typography-html-snippets';
import { StorybookTypographyOverviewComponent } from './storybook-typography-overview.component';

const meta: Meta<StorybookTypographyOverviewComponent> = {
  title: 'Foundations/Typography',
  component: StorybookTypographyOverviewComponent,
};

export default meta;

//👇 We create a “template” of how args map to rendering
const Template: StoryFn<StorybookTypographyOverviewComponent> = (args) => ({
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

export const H1 = () => ({
  template: typographyHtmlSnippets.h1.tag,
});
H1.storyName = 'Headline 1';
H1.parameters = {
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

export const H2 = () => ({
  template: typographyHtmlSnippets.h2.tag,
});
H2.storyName = 'Headline 2';
H2.parameters = {
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

export const H3 = () => ({
  template: typographyHtmlSnippets.h3.tag,
});
H3.storyName = 'Headline 3';
H3.parameters = {
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

export const H4 = () => ({
  template: typographyHtmlSnippets.h4.tag,
});
H4.storyName = 'Headline 4';
H4.parameters = {
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

export const H5 = () => ({
  template: typographyHtmlSnippets.h5.tag,
});
H5.storyName = 'Headline 5';
H5.parameters = {
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

export const TextL = () => ({
  template: typographyHtmlSnippets.textL.class,
});
TextL.storyName = 'Large';
TextL.parameters = {
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

export const BodyTextM = () => ({
  template: typographyHtmlSnippets.bodyTextM.tag,
});
BodyTextM.storyName = 'Normal';
BodyTextM.parameters = {
  docs: {
    source: {
      code: bodyTextMCodeExample,
    },
  },
};

const textSCodeExample = `
Recommended
${typographyHtmlSnippets.textS.tag}

Alternative (CSS class)
${typographyHtmlSnippets.textS.class}

Alternative (SCSS mixin)
${typographyHtmlSnippets.textS.mixin}
`;

export const TextS = () => ({
  template: typographyHtmlSnippets.textS.tag,
});
TextS.storyName = 'Small';
TextS.parameters = {
  docs: {
    source: {
      code: textSCodeExample,
    },
  },
};

const textLHighlightedCodeExample = `
CSS class
${typographyHtmlSnippets.textLHighlighted.class}

SCSS mixin
${typographyHtmlSnippets.textLHighlighted.mixin}
`;

export const TextLHightlighted = () => ({
  template: typographyHtmlSnippets.textLHighlighted.class,
});
TextLHightlighted.storyName = 'Large-highlighted';
TextLHightlighted.parameters = {
  docs: {
    source: {
      code: textLHighlightedCodeExample,
    },
  },
};

const bodyTextMHighlightedCodeExample = `
Recommended
${typographyHtmlSnippets.bodyTextMHighlighted.tag}

Alternative (CSS class)
${typographyHtmlSnippets.bodyTextMHighlighted.class}

Alternative (SCSS mixin)
${typographyHtmlSnippets.bodyTextMHighlighted.mixin}
`;

export const BodyTextMHighlighted = () => ({
  template: typographyHtmlSnippets.bodyTextMHighlighted.tag,
});
BodyTextMHighlighted.storyName = 'Normal-highlighted';
BodyTextMHighlighted.parameters = {
  docs: {
    source: {
      code: bodyTextMHighlightedCodeExample,
    },
  },
};

const textSHightlightedCodeExample = `
Recommended
${typographyHtmlSnippets.textSHighlighted.tag}

Alternative (CSS class)
${typographyHtmlSnippets.textSHighlighted.class}

Alternative (SCSS mixin)
${typographyHtmlSnippets.textSHighlighted.mixin}
`;

export const TextSHighlighted = () => ({
  template: typographyHtmlSnippets.textSHighlighted.tag,
});
TextSHighlighted.storyName = 'Small-highlighted';
TextSHighlighted.parameters = {
  docs: {
    source: {
      code: textSHightlightedCodeExample,
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

export const Button = () => ({
  template: typographyHtmlSnippets.button.storybook,
});
Button.parameters = {
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

export const Label = () => ({
  template: typographyHtmlSnippets.label.class,
});
Label.parameters = {
  docs: {
    source: {
      code: labelCodeExample,
    },
  },
};

const linkCodeExample = `
Recommended
${typographyHtmlSnippets.link.tag}

Alternative (CSS Class)
${typographyHtmlSnippets.link.class}

Alternative (SCSS mixin)
${typographyHtmlSnippets.link.mixin}
`;

export const Link = () => ({
  template: typographyHtmlSnippets.link.class,
});
Link.storyName = 'Normal Link';
Link.parameters = {
  docs: {
    source: {
      code: linkCodeExample,
    },
  },
};

const linkSCodeExample = `
Recommended
${typographyHtmlSnippets.linkS.tag}

Alternative (CSS Class)
${typographyHtmlSnippets.linkS.class}

Alternative (SCSS mixin)
${typographyHtmlSnippets.linkS.mixin}
`;

export const LinkS = () => ({
  template: typographyHtmlSnippets.linkS.class,
});
LinkS.storyName = 'Small Link';
LinkS.parameters = {
  docs: {
    source: {
      code: linkSCodeExample,
    },
  },
};
