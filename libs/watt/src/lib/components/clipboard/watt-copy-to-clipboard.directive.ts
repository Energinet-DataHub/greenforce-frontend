import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { WattToastService } from '../toast';
import { WattClipboardIntlService } from './watt-clipboard-intl.service';

@Directive({
  standalone: true,
  selector: '[wattCopyToClipboard]',
})
export class WattCopyToClipboardDirective {
  private element = inject(ElementRef);
  private clipboard = inject(Clipboard);
  private toast = inject(WattToastService);
  private intl = inject(WattClipboardIntlService);

  @Input('wattCopyToClipboard')
  text?: string;

  @Output() copySuccess = new EventEmitter<boolean>();

  @HostBinding('style.cursor')
  cursor = 'pointer';

  @HostListener('click')
  onClick() {
    const success = this.text
      ? this.clipboard.copy(this.text)
      : this.clipboard.copy(this.element.nativeElement.innerText);

    if (success) {
      this.toast.open({
        type: 'success',
        message: this.intl.success,
      });

      this.copySuccess.emit(true);
    } else {
      this.toast.open({
        type: 'danger',
        message: this.intl.error,
      });

      this.copySuccess.emit(false);
    }
  }
}
