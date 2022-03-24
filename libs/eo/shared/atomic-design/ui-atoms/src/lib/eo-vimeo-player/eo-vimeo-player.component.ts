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
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import Player from '@vimeo/player';

const wrapperClass = 'embed-container';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-vimeo-player',
  styles: [
    `
      :host {
        display: block;
      }

      .poster-image {
        width: 100%;
        cursor: pointer;
      }

      .${wrapperClass} {
        position: relative;
        overflow: hidden;

        max-width: 100%;
        height: 0;
        padding-bottom: 56.25%;

        > iframe {
          position: absolute;
          top: 0;
          left: 0;

          border: 0;
          width: 100%;
          height: 100%;
        }
      }
    `,
  ],
  template: `
    <div class="${wrapperClass}">
      <img
        class="poster-image"
        *ngIf="showPosterImage"
        [src]="posterImage"
        (click)="onVideoPlay()"
      />
      <div #vimeoEmbedContainer></div>
    </div>
  `,
})
export class EoVimeoPlayerComponent implements OnInit {
  showPosterImage = true;

  @ViewChild('vimeoEmbedContainer')
  vimeoEmbedContainer!: ElementRef<HTMLDivElement>;

  @Input()
  posterImage = '/assets/images/vimeo-video-poster.png';

  @Input()
  url = '';

  // Type of DomSanitizer.sanitize return value: 'string | null'.
  // We need 'string' for the video player 'url' property
  // Instead of 'SafeResourceUrl' from 'DomSanitizer.bypassSecurityTrustResourceUrl', which returns an object
  safeUrl: string | null = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.safeUrl = this.sanitizer.sanitize(
      SecurityContext.RESOURCE_URL,
      this.sanitizer.bypassSecurityTrustResourceUrl(this.url)
    );
  }

  onVideoPlay() {
    const vimeoEmbedContainerRef = this.vimeoEmbedContainer.nativeElement;
    vimeoEmbedContainerRef.classList.add(wrapperClass);

    const player = new Player(vimeoEmbedContainerRef, {
      url: this.safeUrl as string,
    });

    player.ready().then(() => {
      player.play();
    });

    this.showPosterImage = false;
  }
}

@NgModule({
  declarations: [EoVimeoPlayerComponent],
  exports: [EoVimeoPlayerComponent],
  imports: [CommonModule],
})
export class EoVimeoPlayerScam {}
