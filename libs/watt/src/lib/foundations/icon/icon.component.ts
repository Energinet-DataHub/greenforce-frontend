import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
  inject,
} from '@angular/core';

import { WattIcon } from './icons';
import { WattIconService } from './icon.service';
import { WattIconSize } from './watt-icon-size';
import { WattIconState } from './watt-icon-state';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'watt-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatIconModule],
})
export class WattIconComponent {
  private iconService = inject(WattIconService);
  @Input()
  set name(value: WattIcon | undefined) {
    this.setIcon(value);

    this.state = this.getDefaultStateForIcon(value);
  }

  /**
   * @description used for `aria-label`
   */
  @Input() label: string | null = null;
  @Input() size: WattIconSize = 'm';
  @Input() state: WattIconState = 'default';

  @HostBinding('class')
  get _cssClass(): string[] {
    return [`icon-size-${this.size}`, `icon-state-${this.state}`];
  }

  /**
   * @ignore
   */
  icon: string | null = null;
  /**
   * @ignore
   */
  customIcon = '';

  /**
   * @ignore
   * @param name
   * @returns
   */
  private setIcon(name?: WattIcon) {
    this.icon = '';
    this.customIcon = '';

    if (!name) {
      console.warn('No icon was provided!');
      return;
    }

    const iconName = this.iconService.getIconName(name);

    this.iconService.isCustomIcon(name) ? (this.customIcon = iconName) : (this.icon = iconName);
  }

  /**
   * @ignore
   * @param name
   * @returns
   */
  private getDefaultStateForIcon(name?: WattIcon): WattIconState {
    switch (name) {
      case 'success':
      case 'danger':
      case 'warning':
      case 'info':
        return name;
      default:
        return 'default';
    }
  }
}
