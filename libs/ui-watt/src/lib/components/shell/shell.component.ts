import { Component } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';

@Component({
  selector: 'watt-shell',
  styleUrls: ['./shell.component.scss'],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  /**
   * @ignore
   */
  sidenavOpened = true;

  /**
   * @ignore
   */
  sidenavMode: MatDrawerMode = 'side';
}
