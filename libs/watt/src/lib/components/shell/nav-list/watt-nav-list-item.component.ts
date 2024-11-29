import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-nav-list-item',
  standalone: true,
  imports: [NgTemplateOutlet, RouterModule],
  template: `
    @if (isExternalLink) {
      <a [href]="link()" [attr.target]="target()"
        ><ng-container *ngTemplateOutlet="templateContent"
      /></a>
    } @else {
      <a
        [routerLink]="link()"
        routerLinkActive="active"
        (isActiveChange)="onRouterLinkActive($event)"
        ><ng-container *ngTemplateOutlet="templateContent"
      /></a>
    }

    <ng-template #templateContent>
      <ng-content />
    </ng-template>
  `,
})
export class WattNavListItemComponent {
  link = input.required<string>();
  target = input<'_self' | '_blank' | '_parent' | '_top'>('_self');
  isActive = output<boolean>();

  get isExternalLink(): boolean {
    return /^(http:\/\/|https:\/\/)/i.test(this.link());
  }

  onRouterLinkActive(isActive: boolean) {
    this.isActive.emit(isActive);
  }
}
