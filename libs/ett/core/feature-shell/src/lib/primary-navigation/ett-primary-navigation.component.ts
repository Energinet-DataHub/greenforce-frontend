import { Component, NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ett-primary-navigation',
  styles: [':host { display: block; }'],
  template: `
    <mat-nav-list>
      <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
        Dashboard
      </a>
    </mat-nav-list>
  `,
})
export class EttPrimaryNavigationComponent {}

@NgModule({
  declarations: [EttPrimaryNavigationComponent],
  exports: [EttPrimaryNavigationComponent],
  imports: [RouterModule, MatListModule],
})
export class EttPrimaryNavigationScam {}
