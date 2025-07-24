//#region License
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
//#endregion
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  Renderer2,
  signal,
  ViewEncapsulation,
} from '@angular/core';

const SELECTOR = 'ett-scroll-view';
const CONTENT_CLASS = 'content';
const NO_SCROLL_CLASS = 'no-scroll';

@Component({
  selector: SELECTOR,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      :root {
        --ett-scroll-view-padding: var(--watt-space-m);
        --ett-scroll-view-content-padding: 0 var(--watt-space-m) 0 0;
        --ett-scroll-view-max-height: calc(100vh - 300px);
        --ett-scroll-view-scrollbar-width: 6px;
        --ett-scroll-view-scrollbar-radius: 50px;
      }

      ${SELECTOR} {
        display: block;
        word-break: break-word;
        padding: var(--ett-scroll-view-padding);
        background: var(--watt-color-neutral-white);
        border-radius: var(--watt-space-xs);
      }

      ${SELECTOR}.${NO_SCROLL_CLASS} .${CONTENT_CLASS}::-webkit-scrollbar {
        width: 0;
      }

      ${SELECTOR} .${CONTENT_CLASS} {
        max-height: var(--ett-scroll-view-max-height);
        word-break: break-word;
        overflow-y: scroll;
        padding: var(--ett-scroll-view-content-padding);

        &::-webkit-scrollbar {
          width: var(--ett-scroll-view-scrollbar-width);
        }

        &::-webkit-scrollbar-thumb,
        &::-webkit-scrollbar-track {
          border-radius: var(--ett-scroll-view-scrollbar-radius);
        }

        &::-webkit-scrollbar-track {
          background: var(--watt-color-neutral-white);
        }

        &::-webkit-scrollbar-thumb {
          background-color: var(--watt-color-primary);
        }
      }
    `,
  ],
  template: `<div class="${CONTENT_CLASS}"><ng-content /></div>`,
})
export class EttScrollViewComponent implements OnDestroy {
  private readonly renderer = inject(Renderer2);
  private readonly elementRef = inject(ElementRef);
  private readonly hasScroll = signal(false);

  private readonly observer = new MutationObserver(() => this.checkScroll());
  private readonly intersectionObserver = new IntersectionObserver(
    this.handleIntersection.bind(this)
  );

  constructor() {
    this.intersectionObserver.observe(this.elementRef.nativeElement);

    effect(() => {
      const shouldShowScroll = this.hasScroll();
      const method = shouldShowScroll ? 'removeClass' : 'addClass';
      this.renderer[method](this.elementRef.nativeElement, NO_SCROLL_CLASS);
    });
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private get contentElement(): HTMLElement {
    return this.elementRef.nativeElement.querySelector(`.${CONTENT_CLASS}`);
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.checkScroll();
        this.observeContentChanges();
      } else {
        this.observer.disconnect();
      }
    });
  }

  private checkScroll(): void {
    const { scrollHeight, clientHeight } = this.contentElement;
    this.hasScroll.set(scrollHeight > clientHeight);
  }

  private observeContentChanges(): void {
    this.observer.observe(this.contentElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  private cleanup(): void {
    this.observer.disconnect();
    this.intersectionObserver.disconnect();
  }
}
