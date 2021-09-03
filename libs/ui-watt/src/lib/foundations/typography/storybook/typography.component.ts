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
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '54px*',
  },
  {
    name: 'Headline 2',
    html: typographyHtmlSnippets.h2.tag,
    size: '32px',
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '48px*',
  },
  {
    name: 'Headline 3',
    html: typographyHtmlSnippets.h3.tag,
    size: '28px',
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '42px*',
  },
  {
    name: 'Headline 4',
    html: typographyHtmlSnippets.h4.tag,
    size: '24px',
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '36px*',
  },
  {
    name: 'Headline 5',
    html: typographyHtmlSnippets.h5.tag,
    size: '20px',
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '30px*',
  },
  {
    name: 'Lead (text-l)',
    html: typographyHtmlSnippets.textL,
    size: '18px',
    weight: 'Medium',
    letterCase: 'Sentence',
    letterSpacing: '0',
    lineHeight: '27px*',
  },
  {
    name: 'Body (text-m)',
    html: typographyHtmlSnippets.bodyTextM.tag,
    size: '16px',
    weight: 'Regular',
    letterCase: 'Sentence',
    letterSpacing: '0',
    lineHeight: '24px*',
  },
  {
    name: 'Small (text-s)',
    html: typographyHtmlSnippets.textS,
    size: '14px',
    weight: 'Regular',
    letterCase: 'Sentence',
    letterSpacing: '0',
    lineHeight: '21px*',
  },
  {
    name: 'Extra small (text-xs)',
    html: typographyHtmlSnippets.textXs,
    size: '12px',
    weight: 'Regular',
    letterCase: 'Sentence',
    letterSpacing: '0',
    lineHeight: '18px*',
  },
  {
    name: 'Button',
    html: typographyHtmlSnippets.button.storybook,
    size: '16px',
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '1.25px',
    lineHeight: '16px',
  },
  {
    name: 'Label',
    html: typographyHtmlSnippets.label.class,
    size: '12px',
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '1.5px',
    lineHeight: '14.4px',
  },
];

@Component({
  selector: 'watt-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss'],
})
export class TypographyComponent {
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
