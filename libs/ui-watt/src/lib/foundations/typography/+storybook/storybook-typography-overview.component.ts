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
import { Component } from '@angular/core';

import { typographyHtmlSnippets } from './shared/typography-html-snippets';

interface Typography {
  name: string;
  html: string;
  size: string;
  weight: string;
  letterCase: string;
  letterSpacing: string;
  lineHeight: string;
}

const typeScale: Typography[] = [
  {
    name: 'Headline 1',
    html: typographyHtmlSnippets.h1.tag,
    size: '36px',
    // eslint-disable-next-line sonarjs/no-duplicate-string
    weight: 'Semibold (600)',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '54px*',
  },
  {
    name: 'Headline 2',
    html: typographyHtmlSnippets.h2.tag,
    size: '32px',
    weight: 'Semibold (600)',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '48px*',
  },
  {
    name: 'Headline 3',
    html: typographyHtmlSnippets.h3.tag,
    size: '28px',
    weight: 'Semibold (600)',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '42px*',
  },
  {
    name: 'Headline 4',
    html: typographyHtmlSnippets.h4.tag,
    size: '24px',
    weight: 'Semibold (600)',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '36px*',
  },
  {
    name: 'Headline 5',
    html: typographyHtmlSnippets.h5.tag,
    size: '20px',
    weight: 'Semibold (600)',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '30px*',
  },
  {
    name: 'Lead (text-l)',
    html: typographyHtmlSnippets.textL.class,
    size: '18px',
    weight: 'Semibold (600)',
    letterCase: 'Sentence',
    letterSpacing: '0',
    lineHeight: '27px*',
  },
  {
    name: 'Body (text-m)',
    html: typographyHtmlSnippets.bodyTextM.tag,
    size: '16px',
    // eslint-disable-next-line sonarjs/no-duplicate-string
    weight: 'Regular (400)',
    letterCase: 'Sentence',
    letterSpacing: '0',
    lineHeight: '24px*',
  },
  {
    name: 'Small (text-s)',
    html: typographyHtmlSnippets.textS.tag,
    size: '14px',
    weight: 'Regular (400)',
    letterCase: 'Sentence',
    letterSpacing: '0',
    lineHeight: '21px*',
  },
  {
    name: 'Extra small (text-xs)',
    html: typographyHtmlSnippets.textXs.class,
    size: '12px',
    weight: 'Regular (400)',
    letterCase: 'Sentence',
    letterSpacing: '0',
    lineHeight: '18px*',
  },
  {
    name: 'Button',
    html: typographyHtmlSnippets.button.storybook,
    size: '14px',
    weight: 'Semibold (600)',
    letterCase: 'All caps',
    letterSpacing: '1.25px',
    lineHeight: '16px',
  },
  {
    name: 'Label',
    html: typographyHtmlSnippets.label.class,
    size: '12px',
    weight: 'Semibold (600)',
    letterCase: 'All caps',
    letterSpacing: '1.5px',
    lineHeight: '14.4px',
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
    'lineHeight',
  ];
  /**
   * @ignore
   */
  dataSource = typeScale;
}
