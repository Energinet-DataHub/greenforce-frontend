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

  constructor(
    private element: ElementRef,
    private clipboard: Clipboard,
    private toast: WattToastService
  ) {}

  @HostBinding('style.cursor')
  cursor = 'pointer';

  @HostListener('click')
  onClick() {
    if (this.text) {
      this.clipboard.copy(this.text);
    } else {
      this.clipboard.copy(this.element.nativeElement.innerText);
    }

    this.toast.open({ type: 'success', message: 'Kopieret til udklipsholder' });
  }
}
