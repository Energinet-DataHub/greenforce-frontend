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
import { PortalModule, TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { WattTopBarService } from './watt-top-bar.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-top-bar-outlet',
  styleUrls: ['./watt-top-bar-outlet.component.scss'],
  standalone: true,
  imports: [PortalModule],
  template: `<ng-template [cdkPortalOutlet]="templatePortal"></ng-template>`,
})
export class WattTopBarOutletComponent implements AfterViewInit, OnDestroy {
  templatePortal!: TemplatePortal<unknown>;

  private destroy$ = new Subject<void>();
  private topBarService = inject(WattTopBarService);
  private viewContainerRef = inject(ViewContainerRef);
  private cd = inject(ChangeDetectorRef);
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);

  ngAfterViewInit(): void {
    this.hide(); // Hide until we have a template to show
    this.topBarService.template.pipe(takeUntil(this.destroy$)).subscribe((template) => {
      this.detach();
      this.attach(template);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.detach();
  }

  private attach(template: TemplateRef<unknown> | null) {
    if (!template) return;
    this.templatePortal = new TemplatePortal(template, this.viewContainerRef);
    this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'block');
    this.cd.detectChanges();
  }

  private detach() {
    if (this.templatePortal?.isAttached) {
      this.templatePortal.detach();
      this.hide();
    }
  }

  private hide() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
  }
}
