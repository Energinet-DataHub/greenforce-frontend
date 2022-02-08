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
import { Component } from '@angular/core';

import { typographyHtmlSnippets } from './shared/typography-html-snippets';

interface Typography {
  name: string;
  html: string;
  size: string;
  weight: string;
  letterCase: string;
  letterSpacing: string;
}

const typeScale: Typography[] = [
  {
    name: 'headline 1',
    html: typographyHtmlSnippets.h1.tag,
    size: 'XXL',
    weight: 'Bold',
    letterCase: 'Sentence',
    letterSpacing: '0'
  },
  {
    name: 'Headline 2',
    html: typographyHtmlSnippets.h2.tag,
    size: 'XL',
    weight: 'Bold',
    letterCase: 'Sentence',
    letterSpacing: '0'
  },
  {
    name: 'Headline 3',
    html: typographyHtmlSnippets.h3.tag,
    size: 'M',
    weight: 'Bold',
    letterCase: 'Sentence',
    letterSpacing: '0'
  },
  {
    name: 'Headline 4',
    html: typographyHtmlSnippets.h4.tag,
    size: 'M',
    weight: 'Bold',
    letterCase: 'Sentence',
    letterSpacing: '0'
  },
  {
    name: 'Headline 5',
    html: typographyHtmlSnippets.h5.tag,
    size: 'M',
    weight: 'Bold',
    letterCase: 'Sentence',
    letterSpacing: '0'
  },
  {
    name: 'large',
    html: typographyHtmlSnippets.textL.class,
    size: 'L',
    weight: 'Regular',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    name: 'normal',
    html: typographyHtmlSnippets.bodyTextM.tag,
    size: 'M',
    weight: 'Regular',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    name: 'small',
    html: typographyHtmlSnippets.textS.tag,
    size: 'S',
    weight: 'Regular',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    name: 'large-highlighted',
    html: typographyHtmlSnippets.textLHighlighted.class,
    size: 'L',
    weight: 'Bold',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    name: 'normal-highlighted',
    html: typographyHtmlSnippets.bodyTextMHighlighted.tag,
    size: 'M',
    weight: 'Bold',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    name: 'small-highlighted',
    html: typographyHtmlSnippets.textSHighlighted.tag,
    size: 'S',
    weight: 'Bold',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    name: 'Button',
    html: typographyHtmlSnippets.button.storybook,
    size: 'M',
    weight: 'Bold',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    name: 'Label',
    html: typographyHtmlSnippets.label.class,
    size: 'S',
    weight: 'Bold',
    letterCase: 'All caps',
    letterSpacing: '1.25px',
  },
  {
    name: 'Normal Link',
    html: typographyHtmlSnippets.link.class,
    size: 'M',
    weight: 'Regular',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
  {
    name: 'Small Link',
    html: typographyHtmlSnippets.linkS.class,
    size: 'S',
    weight: 'Regular',
    letterCase: 'Sentence',
    letterSpacing: '0',
  },
];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-typography-overview',
  templateUrl: './storybook-typography-overview.component.html',
  styleUrls: ['./storybook-typography-overview.component.scss'],
})
export class StorybookTypographyOverviewComponent {
  /**
   * @ignore
   */
  displayedColumns: string[] = [
    'name',
    'size',
    'weight',
    'letterCase',
    'letterSpacing',
  ];
  /**
   * @ignore
   */
  dataSource = typeScale;
}
