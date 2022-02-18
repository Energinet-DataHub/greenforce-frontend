import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'energinet-datahub-eo-privacy-page-shell',
  template: `
    <p>
      eo-privacy-page-shell works!
    </p>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class EoPrivacyPageShellComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
