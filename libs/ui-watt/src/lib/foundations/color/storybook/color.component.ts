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
  var: string;
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
      colors: [
        this.getColor('primary', Colors.primary),
        this.getColor('primary-dark', Colors.primaryDark),
      ],
    },
    {
      name: 'focus',
      title: 'Focus Colors',
      colors: [
        this.getColor('focus', Colors.focus),
        this.getColor('selection', Colors.selection),
      ],
    },
    {
      name: 'neutral',
      title: 'Neutral Colors',
      colors: [
        this.getColor('black', Colors.black),
        this.getColor('white', Colors.white),
        this.getColor('grey-50', Colors.grey50),
        this.getColor('grey-100', Colors.grey100),
        this.getColor('grey-200', Colors.grey200),
        this.getColor('grey-300', Colors.grey300),
        this.getColor('grey-400', Colors.grey400),
        this.getColor('grey-500', Colors.grey500),
        this.getColor('grey-600', Colors.grey600),
        this.getColor('grey-700', Colors.grey700),
        this.getColor('grey-800', Colors.grey800),
        this.getColor('grey-900', Colors.grey900),
      ],
    },
    {
      name: 'state',
      title: 'State Colors',
      description:
        'State color helps users find people, identify status, see actions, locate help, and understand next steps. The consistent use of color keeps cognitive load low and makes for a unified and engaging user experience.',
      colors: [
        this.getColor('danger', Colors.danger),
        this.getColor('warning', Colors.warning),
        this.getColor('success', Colors.success),
        this.getColor('info', Colors.info),
        this.getColor('danger-light', Colors.dangerLight),
        this.getColor('warning-light', Colors.warningLight),
        this.getColor('success-light', Colors.successLight),
        this.getColor('info-light', Colors.infoLight),
      ],
    },
  ];

  constructor(private colorHelperService: ColorHelperService) {}

  /**
   * @ignore
   */
  copyToClipboard(color: string) {
    `var(${navigator.clipboard.writeText(color)})`;
  }

  /**
   * @ignore
   */
   private getColor(name: string, color: Colors) {
    return {
      name,
      var: color,
      color: this.colorHelperService.getColor(color),
      contrast: this.colorHelperService.getColorContrast(color),
    };
  }
}
