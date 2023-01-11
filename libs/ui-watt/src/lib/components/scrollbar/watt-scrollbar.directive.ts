/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
} from '@angular/core';
import { tap } from 'rxjs';
import { WattResizeObserverService } from '../../utils/resize-observer/watt-resize-observer.service';

@Directive({
  standalone: true,
  selector: '[wattScrollbar]',
})
export class WattScrollbarDirective implements AfterViewInit {
  @HostBinding('class') class = 'watt-scrollbar';
  @HostBinding('class.watt-scrollbar-visible') isVisible = false;
  @HostBinding('style.--watt-scrollbar-top') top = 0;
  @HostBinding('style.--watt-scrollbar-height') height = 0;
  @HostBinding('style.--watt-scrollbar-left') left = 0;
  @HostBinding('style.--watt-scrollbar-offset') offset = 0;

  private resizeObserver = inject(WattResizeObserverService);
  private element: HTMLElement = inject(ElementRef).nativeElement;
  private ratio = 1;
  private isDragScroll = false;
  private isInside = false;
  private dragMin = 0;

  ngAfterViewInit() {
    this.resizeObserver
      .observe(this.element)
      .pipe(tap(console.log)) // takeUntil
      .subscribe(() => {
        this.ratio = this.element.clientHeight / this.element.scrollHeight;
        this.height = this.element.clientHeight * this.ratio;
        this.left = this.element.clientWidth + this.element.offsetLeft;
        this.top = this.element.scrollTop * this.ratio;
      });
  }

  @HostListener('mouseenter')
  @HostListener('focusin')
  onEnter() {
    this.isInside = true;
    this.isVisible = true;
  }

  @HostListener('mouseleave')
  @HostListener('focusout')
  onLeave() {
    this.isInside = false;
    if (this.isDragScroll) return;
    this.isVisible = false;
  }

  @HostListener('scroll')
  onScroll() {
    this.offset = this.element.scrollTop;
    this.top = this.element.scrollTop * this.ratio;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    // Check if click is inside the scrollbar
    if (event.offsetX < this.element.clientWidth - 12) return;

    if (event.offsetY < this.top || event.offsetY > this.top + this.height) {
      const top = (event.offsetY - this.height / 2) / this.ratio;
      this.element.scroll({ top });
    }

    this.dragMin = event.clientY - this.top;
    this.isDragScroll = true;
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.isDragScroll = false;
    this.isVisible = this.isInside;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragScroll) return;
    const scrollTop = this.element.scrollTop * this.ratio;
    const delta = event.clientY - (this.dragMin + scrollTop);
    const top = this.element.scrollTop + delta / this.ratio;
    this.element.scroll({ top });
  }
}
