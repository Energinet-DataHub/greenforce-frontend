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
  Component,
  DestroyRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';

import { translations } from '@energinet-datahub/eo/translations';
import { EoVimeoPlayerComponent } from '@energinet-datahub/eo/shared/components/ui-vimeo-player';

@Component({
  selector: 'eo-learn-more',
  imports: [WATT_MODAL, ReactiveFormsModule, EoVimeoPlayerComponent],
  styles: `
    .eo-learn-more-modal {
      --watt-modal-content-padding: 0;

      .watt-modal {
        grid-template-rows: auto;
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content />

    @if (isOpen()) {
      <watt-modal
        size="small"
        [loading]="isLoading()"
        (closed)="onClosed()"
        [hideCloseButton]="true"
        [panelClass]="['eo-learn-more-modal']"
      >
        <eo-vimeo-player
          poster="assets/images/vimeo-video-poster.png"
          video="https://player.vimeo.com/video/642352286?h=91e1a8b63c&badge=0&autopause=0&player_id=0&app_id=58479"
        />
      </watt-modal>
    }
  `,
})
export class EoLearnMoreComponent implements OnInit {
  private _modal?: WattModalComponent;

  @ViewChild(WattModalComponent)
  set modal(modal: WattModalComponent | undefined) {
    this._modal = modal;
    if (modal && this.isOpen()) {
      queueMicrotask(() => modal.open());
    }
  }
  get modal(): WattModalComponent | undefined {
    return this._modal;
  }

  @HostListener('click')
  onClick() {
    if (this.isOpen()) return;
    this.isOpen.set(true);
    // modal opens via the ViewChild setter once it exists
  }

  protected language = new FormControl();
  protected translations = translations;
  protected isOpen = signal<boolean>(false);
  protected isLoading = signal<boolean>(true);

  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isLoading.set(false);
      });
  }

  onClosed() {
    this.isOpen.set(false);
  }
}
