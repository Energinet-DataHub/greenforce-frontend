import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

interface Scale {
  name: string;
  sizePx: number;
  sizeRem: number;
}

const spacingScales: Scale[] = [
  {
    name: 'space-xs',
    sizePx: 4,
    sizeRem: 0.25,
  },
  {
    name: 'space-s',
    sizePx: 8,
    sizeRem: 0.5,
  },
  {
    name: 'space-m',
    sizePx: 16,
    sizeRem: 1,
  },
  {
    name: 'space-l',
    sizePx: 32,
    sizeRem: 2,
  },
  {
    name: 'space-xl',
    sizePx: 64,
    sizeRem: 4,
  },
];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-spacing-overview',
  templateUrl: './storybook-spacing-overview.component.html',
  styleUrls: ['./storybook-spacing-overview.component.scss'],
  standalone: true,
  imports: [MatTableModule],
})
export class StorybookSpacingOverviewComponent {
  /**
   * @ignore
   */
  displayedColumns: string[] = ['name', 'sizePx', 'sizeRem', 'visualExample'];

  /**
   * @ignore
   */
  dataSource = spacingScales;
}
