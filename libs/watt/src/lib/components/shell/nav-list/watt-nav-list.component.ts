import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';

import { WattExpandOnActiveLinkDirective } from './watt-expand-on-active-link.directive';
import { WattNavListItemComponent } from './watt-nav-list-item.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-nav-list',
  styleUrls: ['./watt-nav-list.component.scss'],
  templateUrl: './watt-nav-list.component.html',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    RouterModule,
    MatExpansionModule,
    WattNavListItemComponent,
    WattExpandOnActiveLinkDirective,
  ],
})
export class WattNavListComponent {
  /**
   * @ignore
   */
  @ContentChildren(WattNavListItemComponent)
  navListItemComponents: QueryList<WattNavListItemComponent> | null = null;

  @Input()
  expandable = false;

  @Input()
  title = '';

  /**
   * @ignore
   */
  @HostBinding('class.watt-nav-list--expandable')
  get expandableClass() {
    return this.expandable;
  }
}
