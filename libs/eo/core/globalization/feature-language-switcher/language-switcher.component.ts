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
  Output,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
  EventEmitter,
  Input,
} from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { MatDialogModule } from '@angular/material/dialog';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  WATT_MODAL,
  WattModalComponent,
  WattModalService,
} from '@energinet-datahub/watt/modal';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';

import { translations } from '@energinet-datahub/eo/translations';

@Component({
  selector: 'eo-language-switcher',
  encapsulation: ViewEncapsulation.None,
  providers: [WattModalService],
  imports: [
    MatDialogModule,
    WattButtonComponent,
    WATT_MODAL,
    TranslocoPipe,
    WattDropdownComponent,
    ReactiveFormsModule,
  ],
  styles: `
    .eo-language-switcher-content {
      watt-dropdown { width: 100%; }
      watt-field { min-height: 0 !important; }
    }
  `,
  template: `
    <ng-content />

    @if (isOpen()) {
      <watt-modal
        [autoOpen]="true"
        size="small"
        [restoreFocus]="false"
        [loading]="isLoading()"
        [title]="translations.languageSwitcher.title | transloco"
        [closeLabel]="translations.languageSwitcher.closeLabel | transloco"
        (closed)="onClosed()"
      >
        <div class="eo-language-switcher-content">
          <watt-dropdown
            [label]="translations.languageSwitcher.languagesLabel | transloco"
            [options]="languages"
            panelWidth="auto"
            [placeholder]="translations.languageSwitcher.languagesPlaceholder | transloco"
            [showResetOption]="false"
            [formControl]="language"
          />
        </div>

        <watt-modal-actions>
          <watt-button variant="secondary" (click)="onClosed()">
            {{ translations.languageSwitcher.cancel | transloco }}
          </watt-button>
          <watt-button variant="primary" (click)="onSave()">
            {{ translations.languageSwitcher.save | transloco }}
          </watt-button>
        </watt-modal-actions>
      </watt-modal>
    }
  `,
})
export class EoLanguageSwitcherComponent implements OnInit {
  @ViewChild(WattModalComponent) modal?: WattModalComponent;
  @Input() changeUrl = false;

  @HostListener('click')
  onClick() {
    if (!this.isOpen()) this.isOpen.set(true);
  }

  @Output() closed = new EventEmitter<void>();

  protected language = new FormControl();
  protected translations = translations;
  protected isOpen = signal<boolean>(false);
  protected isLoading = signal<boolean>(true);
  protected languages!: WattDropdownOption[];

  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private readonly document = inject(DOCUMENT);

  ngOnInit(): void {
    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isLoading.set(false);
        this.setLanguages();
      });
  }

  private setLanguages() {
    this.languages = [
      {
        value: 'en',
        displayValue: this.transloco.translate(this.translations.languageSwitcher.languages.en),
      },
      {
        value: 'da',
        displayValue: this.transloco.translate(this.translations.languageSwitcher.languages.da),
      },
    ];

    this.language.setValue(this.transloco.getActiveLang());
    this.document.documentElement.lang = this.transloco.getActiveLang();
  }

  onSave() {
    if (this.changeUrl) {
      const currentUrl = this.router.url;
      const base = currentUrl.split('/')[1];
      const next = currentUrl.replace(base, this.language.value as string);
      this.router.navigateByUrl(next);
    }

    this.transloco.setActiveLang(this.language.value as string);
    this.modal?.close(true);
  }

  onClosed() {
    this.isOpen.set(false);
    this.closed.emit();
  }
}
