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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { first } from 'rxjs';

import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';

import { translations } from '@energinet-datahub/eo/translations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-metering-points-helper-modal',
  imports: [WATT_MODAL, TranslocoPipe],
  standalone: true,
  styles: `
    .eo-metering-points-helper-modal .watt-modal {
      ul {
        margin-bottom: var(--watt-space-m);
      }
    }
  `,
  template: `
    @if (opened) {
      <watt-modal
        #modal
        [panelClass]="['eo-metering-points-helper-modal']"
        [title]="translations.meteringPoints.infoBoxTitle | transloco"
      >
        <div [innerHTML]="translations.meteringPoints.infoBoxContent | transloco"></div>
      </watt-modal>
    }
  `,
})
export class EoMeteringPointsHelperModalComponent {
  private cd = inject(ChangeDetectorRef);
  private transloco = inject(TranslocoService);

  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  protected translations = translations;
  public opened = false;

  open() {
    // This is a workaround for "lazy loading" the modal content
    this.opened = true;
    this.cd.detectChanges();
    this.modal.open();
  }

  save() {
    // Save changes
  }

  close(result: boolean) {
    this.modal.close(result);

    // We wait for setting opened, to the modal is actually closed to avoid any flickerness
    this.modal.closed.pipe(first()).subscribe(() => {
      this.opened = false;
    });
  }
}
