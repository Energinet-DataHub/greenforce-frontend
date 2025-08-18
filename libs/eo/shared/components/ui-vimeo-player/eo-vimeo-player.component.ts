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
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  SecurityContext,
  inject,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import Player from '@vimeo/player';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-vimeo-player',
  imports: [],
  styles: [
    `
      :host {
        display: block;
        position: relative;
        overflow: hidden;
        max-width: 100%;
        height: 0;
        padding-bottom: 56.25%;
      }
      :host ::ng-deep iframe {
        position: absolute;
        top: 0;
        left: 0;
        border: 0;
        width: 100%;
        height: 100%;
      }
      .poster-image {
        width: 100%;
        cursor: pointer;
      }
    `,
  ],
  template: `
    @if (isPosterVisible) {
      <img class="poster-image" [src]="poster" (click)="onVideoPlay()" />
    }
  `,
})
export class EoVimeoPlayerComponent {
  private sanitizer = inject(DomSanitizer);
  private changeDetector = inject(ChangeDetectorRef);
  private hostElement = inject(ElementRef<HTMLElement>);

  #safePosterUrl = '';
  #safeVideoUrl: string | null = null;

  @Input()
  set poster(url: string | null) {
    if (url === null) return;
    const maybe = this.sanitizer.sanitize(
      SecurityContext.URL,
      this.sanitizer.bypassSecurityTrustUrl(url)
    );
    if (maybe === null) {
      console.error(`The specified Vimeo poster URL is unsafe: "${url}"`);
      return;
    }
    this.#safePosterUrl = maybe;
  }
  get poster(): string {
    return this.#safePosterUrl;
  }

  @Input()
  set video(url: string | null) {
    if (url === null) return;
    this.#safeVideoUrl = this.sanitizer.sanitize(
      SecurityContext.RESOURCE_URL,
      this.sanitizer.bypassSecurityTrustResourceUrl(url)
    );
  }

  isPosterVisible = true;

  async onVideoPlay(): Promise<void> {
    if (this.#safeVideoUrl === null) {
      console.error(`The specified Vimeo video URL is unsafe or missing.`);
      return;
    }

    const vimeoPlayer = new Player(this.hostElement.nativeElement, { url: this.#safeVideoUrl });
    await vimeoPlayer.ready();

    this.isPosterVisible = false;
    this.changeDetector.detectChanges();
    vimeoPlayer.play();
  }
}
