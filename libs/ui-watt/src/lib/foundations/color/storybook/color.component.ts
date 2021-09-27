import { Component } from '@angular/core';
import { ColorHelperService } from '../color-helper.service';
import { Colors } from '../colors';

interface ColorType {
  name: string;
  title: string;
  description?: string;
  colors: Color[];
}
interface Color {
  name: string;
  color: string;
  contrast: string;
}
@Component({
  selector: 'watt-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
})
export class ColorComponent {
  /**
   * @ignore
   */
  colorTypes: ColorType[] = [
    {
      name: 'primary',
      title: 'Primary Colors',
      description:
        'The primary colors are the brand colors that are main colors used on central elements like primary buttons and in the main navigation.',
      colors: [],
    },
    { name: 'focus', title: 'Focus Colors', colors: [] },
    { name: 'neutral', title: 'Neutral Colors', colors: [] },
    {
      name: 'state',
      title: 'State Colors',
      description:
        'State color helps users find people, identify status, see actions, locate help, and understand next steps. The consistent use of color keeps cognitive load low and makes for a unified and engaging user experience.',
      colors: [],
    },
  ];

  constructor() {
    this.groupColors();
    console.log(this.colorTypes);
  }

  /**
   * @ignore
   */
  private groupColors() {
    return Object.values(Colors).map((color) => {
      const withoutPrefix = color.replace('--watt-', '');
      const colorGroup = withoutPrefix.split('-')[0];
      const name = withoutPrefix
        .replace(colorGroup, '')
        .replace('-colors-', '');

      const group = this.colorTypes.find((x) => {
        return x.name === colorGroup;
      });

      group?.colors.push({
        name,
        color: `var(${color})`,
        contrast: `var(${color}-contrast)`,
      });
    });
  }
}
