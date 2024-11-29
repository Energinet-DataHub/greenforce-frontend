import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  TemplateRef,
  ViewEncapsulation,
  contentChildren,
  viewChild,
} from '@angular/core';

import { WattIconComponent } from '../../foundations/icon/icon.component';
import { Subject } from 'rxjs';
import { outputFromObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'watt-breadcrumb',
  standalone: true,
  imports: [WattIconComponent],
  encapsulation: ViewEncapsulation.None,
  template: `<ng-template #templateRef><ng-content /></ng-template>`,
})
export class WattBreadcrumbComponent {
  templateRef = viewChild.required<TemplateRef<unknown>>('templateRef');
  // Used to determine if the breadcrumb is interactive or not
  actionEmitter = new Subject<unknown>();
  click = outputFromObservable(this.actionEmitter);
}

/**
 * Usage:
 * `import { WATT_BREADCRUMBS } from '@energinet-datahub/watt/breadcrumbs';`
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgTemplateOutlet, WattIconComponent],
  selector: 'watt-breadcrumbs',
  styleUrls: ['./watt-breadcrumbs.component.scss'],
  template: `
    <nav>
      @for (breadcrumb of breadcrumbs(); track breadcrumb; let isLast = $last) {
        <span
          class="watt-breadcrumb"
          (click)="breadcrumb.actionEmitter.next($event)"
          [class.interactive]="breadcrumb.actionEmitter.observed"
          [attr.role]="breadcrumb.actionEmitter.observed ? 'link' : null"
        >
          <ng-container *ngTemplateOutlet="breadcrumb.templateRef()" />
          @if (!isLast) {
            <watt-icon name="right" />
          }
        </span>
      }
    </nav>
  `,
})
export class WattBreadcrumbsComponent {
  /**
   * @ignore
   */
  breadcrumbs = contentChildren<WattBreadcrumbComponent>(WattBreadcrumbComponent);
}

export const WATT_BREADCRUMBS = [WattBreadcrumbsComponent, WattBreadcrumbComponent] as const;
