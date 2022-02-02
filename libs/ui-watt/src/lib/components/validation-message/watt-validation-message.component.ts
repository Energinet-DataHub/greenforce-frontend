import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

export type WattValidationMessageType =
  | 'info'
  | 'warning'
  | 'success'
  | 'danger';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-validation-message',
  styleUrls: ['./watt-validation-message.component.scss'],
  templateUrl: './watt-validation-message.component.html',
})
export class WattValidationMessageComponent {
  @Input() label = '';
  @Input() message = '';
  @Input() type: WattValidationMessageType = 'info';

  /**
   * @ignore
   */
  @HostBinding('class') get cssClass() {
    return `watt-validation-message-${this.type}`;
  }
}
