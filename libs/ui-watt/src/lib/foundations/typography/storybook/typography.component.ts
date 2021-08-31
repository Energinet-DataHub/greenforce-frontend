import { Component } from '@angular/core';

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
    html: '<h1>Headline 1</h1>',
    size: '36px',
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '54px',
  },
  {
    name: 'Headline 2',
    html: '<h2>Headline 2</h2>',
    size: '32px',
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '48px',
  },
  {
    name: 'Headline 3',
    html: '<h3>Headline 3</h3>',
    size: '28px',
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '42px',
  },
  {
    name: 'Headline 4',
    html: '<h4>Headline 4</h4>',
    size: '24px',
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '36px',
  },
  {
    name: 'Headline 5',
    html: '<h5>Headline 5</h5>',
    size: '20px',
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '30px',
  },
  {
    name: 'Lead (text-l)',
    html: '<p class="watt-text-l">Lead (text-l)</p>',
    size: '18px',
    weight: 'Medium',
    letterCase: 'Sentence',
    letterSpacing: '0',
    lineHeight: '27px',
  },
  {
    name: 'Body (text-m)',
    html: '<p>Body (text-m)</p>',
    size: '16px',
    weight: 'Regular',
    letterCase: 'Sentence',
    letterSpacing: '0',
    lineHeight: '24px',
  },
  {
    name: 'Small (text-s)',
    html: '<p><small>Body (text-s)</small></p>',
    size: '14px',
    weight: 'Regular',
    letterCase: 'Sentence',
    letterSpacing: '0',
    lineHeight: '21px',
  },
  {
    name: 'Extra small (text-xs)',
    html: '<p class="watt-text-xs">Extra small (text-xs)</p>',
    size: '12px',
    weight: 'Regular',
    letterCase: 'Sentence',
    letterSpacing: '0',
    lineHeight: '18px',
  },
  {
    name: 'Button',
    html: '<p class="watt-button">Button</p>',
    size: '16px',
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '1.25px',
    lineHeight: '16px',
  },
  {
    name: 'Label',
    html: '<p class="watt-label">Label</p>',
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
