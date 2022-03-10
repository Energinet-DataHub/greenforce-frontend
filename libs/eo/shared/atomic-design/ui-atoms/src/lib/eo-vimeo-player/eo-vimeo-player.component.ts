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
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgModule,
  OnInit,
  SecurityContext,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import Player from '@vimeo/player';

const selector = 'eo-vimeo-player';

@Component({
  template: `
    <div class="${selector}__embed-container">
      <img
        class="${selector}__poster-image"
        *ngIf="showPosterImage"
        [src]="posterImage"
        (click)="onVideoPlay($event)"
      />
      <div #vimeoEmbedContainer></div>
    </div>
  `,
  selector,
  styles: [
    `
      ${selector} {
        display: block;
      }
      .${selector}__poster-image {
        width: 100%;
        cursor: pointer;
      }
      .${selector}__embed-container {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        max-width: 100%;

        > iframe {
          border: 0;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoVimeoPlayerComponent implements OnInit {
  showPosterImage = true;

  @ViewChild('vimeoEmbedContainer')
  vimeoEmbedContainer!: ElementRef<HTMLDivElement>;

  @Input()
  posterImage = '/assets/images/vimeo-video-poster.png';

  @Input()
  url = '';

  // Type of DomSanitizer.sanitize return value.
  // We need 'string | null' for the video player 'url' property, instead of 'SafeResourceUrl' from 'bypassSecurityTrustResourceUrl'
  safeUrl: string | null = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.safeUrl = this.sanitizer.sanitize(
      SecurityContext.RESOURCE_URL,
      this.sanitizer.bypassSecurityTrustResourceUrl(this.url)
    );
  }

  onVideoPlay(event: Event) {
    this.showPosterImage = false;

    const vimeoEmbedContainerRef = this.vimeoEmbedContainer.nativeElement;
    vimeoEmbedContainerRef.classList.add(`${selector}__embed-container`);

    const player = new Player(vimeoEmbedContainerRef, {
      url: this.safeUrl as string,
    });

    player.on('loaded', () => player.play());
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [EoVimeoPlayerComponent],
  exports: [EoVimeoPlayerComponent],
})
export class EoVimeoPlayerScam {}
