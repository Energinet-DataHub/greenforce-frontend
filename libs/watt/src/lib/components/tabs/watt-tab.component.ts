import { Component, TemplateRef, input, output, viewChild } from '@angular/core';

@Component({
  standalone: true,
  selector: 'watt-tab',
  template: `<ng-template>
    <ng-content />
  </ng-template>`,
})
export class WattTabComponent {
  templateRef = viewChild.required<TemplateRef<unknown>>(TemplateRef);
  label = input<string>('');
  changed = output<void>();

  emitChange() {
    this.changed.emit();
  }
}
