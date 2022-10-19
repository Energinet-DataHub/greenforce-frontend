import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { WattToastService } from '../toast';

@Directive({
  standalone: true,
  selector: '[wattCopyToClipboard]',
})
export class WattCopyToClipboardDirective {
  @Input('wattCopyToClipboard') text?: string;
  @Input() wattCopyToClipboardSuccess = '';
  @Input() wattCopyToClipboardError = '';

  constructor(
    private element: ElementRef,
    private clipboard: Clipboard,
    private toast: WattToastService
  ) {}

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
        message: this.wattCopyToClipboardSuccess,
      });
    } else {
      this.toast.open({
        type: 'danger',
        message: this.wattCopyToClipboardError,
      });
    }
  }
}
