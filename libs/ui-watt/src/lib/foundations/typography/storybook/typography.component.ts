import { Component } from '@angular/core';

interface Typography {
  name: string;
  size: string;
  weight: string;
  letterCase: string;
  letterSpacing: string;
  lineHeight: string;
  tag: string;
}

const typeScale: Typography[] = [
  {
    name: 'Headline 1',
    size: '36px',
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '54',
    tag: 'h1',
  },
  {
    name: 'Headline 2',
    size: '32px',
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '48',
    tag: 'h2',
  },
  {
    name: 'Headline 3',
    size: '28px',
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '42',
    tag: 'h3',
  },
  {
    name: 'Headline 4',
    size: '24px',
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '36',
    tag: 'h4',
  },
  {
    name: 'Headline 5',
    size: '20px',
    weight: 'Medium',
    letterCase: 'All caps',
    letterSpacing: '0',
    lineHeight: '30',
    tag: 'h5',
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
