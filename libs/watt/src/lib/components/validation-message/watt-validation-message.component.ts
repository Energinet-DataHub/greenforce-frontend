import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  inject,
} from '@angular/core';

import { WattIcon } from '../../foundations/icon/icons';
import { WattIconComponent } from '../../foundations/icon/icon.component';

export type WattValidationMessageType = 'info' | 'warning' | 'success' | 'danger';
export type WattValidationMessageSize = 'compact' | 'normal';
/**
 * Usage:
 * `import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';`
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-validation-message',
  styleUrls: ['./watt-validation-message.component.scss'],
  templateUrl: './watt-validation-message.component.html',
  standalone: true,
  imports: [WattIconComponent],
})
export class WattValidationMessageComponent implements AfterViewInit {
  @Input() label = '';
  @Input() message = '';
  @Input() icon?: WattIcon;
  @Input() type: WattValidationMessageType = 'info';
  @Input() size: WattValidationMessageSize = 'compact';
  @Input() autoScrollIntoView = true;

  /**
   * @ignore
   */
  @HostBinding('class') get cssClass() {
    return `watt-validation-message-type--${this.type} watt-validation-message-size--${this.size}`;
  }

  @HostBinding('attr.role') get ariaRole() {
    return this.type === 'warning' || this.type === 'danger' ? 'alert' : 'status';
  }

  private elementRef = inject(ElementRef);

  ngAfterViewInit() {
    if (this.autoScrollIntoView) {
      // Try to win over other auto scrolling behavior such as auto focus
      setTimeout(() => {
        this.elementRef.nativeElement.scrollIntoView();
      }, 100);
    }
  }
}
