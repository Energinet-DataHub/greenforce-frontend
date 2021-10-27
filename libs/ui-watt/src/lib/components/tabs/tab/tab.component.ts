import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'watt-tab',
  templateUrl: './tab.component.html',
})
export class WattTabComponent {
  @Input() label = '';
  @ViewChild('templateRef') public templateRef?: TemplateRef<unknown>;
}
